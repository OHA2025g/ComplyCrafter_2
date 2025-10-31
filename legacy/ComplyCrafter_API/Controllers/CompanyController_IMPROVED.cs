using AlphaUtil.Core;
using AlphaUtil.Core.Models;
using Microsoft.AspNetCore.Mvc;
using ComplyCrafter_BL;
using ComplyCrafter_Data;
using static QRCoder.PayloadGenerator;
using Newtonsoft.Json;
using System.Xml.Linq;
using System.Web;
using System.Diagnostics;
using Microsoft.Extensions.Logging;

namespace ComplyCrafter_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompanyController : BaseController<Company, CompanyView>
    {
        private readonly ICompany _impl;
        private readonly IApiLog _apiLog;
        private readonly IUserSubscriptions _userSub;
        private readonly ILogger<CompanyController> _logger;
        
        // Configuration constants
        private const int API_TIMEOUT_SECONDS = 30;
        private const int MAX_RETRY_ATTEMPTS = 2;
        private const int RETRY_DELAY_MILLISECONDS = 1000;

        public CompanyController(
            ICompany impl, 
            IApiLog apiLog, 
            IUserSubscriptions userSubscriptions,
            ILogger<CompanyController> logger) : base(impl)
        {
            this._impl = impl;
            _apiLog = apiLog;
            _userSub = userSubscriptions;
            _logger = logger;
        }

        //Get Company List for logged in user
        [Authorize]
        [HttpGet("CompanyList")]
        public virtual IEnumerable<CompanyView> UserCompanyList()
        {
            IEnumerable<CompanyView> res = _impl.GetByUserId(User!.CompanyAdminUserId);
            return res;
        }

        /// <summary>
        /// Search companies by name in MCA database
        /// IMPROVED: With timeout, retry, error handling, and fallback
        /// </summary>
        [HttpGet("NameToCin/{name}")]
        public async Task<Response> NameToCin(string name = "")
        {
            var stopwatch = Stopwatch.StartNew();
            
            try
            {
                _logger.LogInformation($"NameToCin called with name: {name}");
                
                if (string.IsNullOrWhiteSpace(name))
                {
                    _logger.LogWarning("NameToCin called with empty name");
                    return new Response(false, "Company name is empty");
                }

                // Attempt to fetch from MCA API with retry
                string? mcaResult = await FetchFromMcaApiWithRetry(
                    $"http://45.142.237.183:8080/mca/search?search_type=company&id={HttpUtility.UrlEncode(name)}",
                    "NameToCin"
                );

                if (!string.IsNullOrEmpty(mcaResult))
                {
                    stopwatch.Stop();
                    _logger.LogInformation($"NameToCin successful for '{name}' in {stopwatch.ElapsedMilliseconds}ms");
                    return new Response(true, "Successfully retrieved company list", mcaResult);
                }

                // Fallback to SurePass API if MCA fails
                _logger.LogWarning($"MCA API failed for '{name}', attempting SurePass fallback");
                
                var requestBody = new { company_name_search = name };
                var surePassResult = await _apiLog.HitApi(
                    R.AppSet("SurePass:NameToCin"), 
                    requestBody, 
                    HttpMethod.Post
                );

                if (!string.IsNullOrEmpty(surePassResult))
                {
                    stopwatch.Stop();
                    _logger.LogInformation($"NameToCin successful via SurePass for '{name}' in {stopwatch.ElapsedMilliseconds}ms");
                    return new Response(true, "Successfully retrieved company list (via backup API)", surePassResult);
                }

                // Both APIs failed
                stopwatch.Stop();
                _logger.LogError($"Both MCA and SurePass APIs failed for '{name}' after {stopwatch.ElapsedMilliseconds}ms");
                return new Response(
                    false, 
                    "Unable to fetch company data. The MCA service is currently slow or unavailable. Please try again in a moment."
                );
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                _logger.LogError(ex, $"Exception in NameToCin for '{name}' after {stopwatch.ElapsedMilliseconds}ms");
                return new Response(
                    false, 
                    "An error occurred while searching for companies. Please try again later."
                );
            }
        }

        /// <summary>
        /// Create company from CIN
        /// IMPROVED: With timeout, retry, error handling, and fallback
        /// </summary>
        [Authorize]
        [HttpGet("Create/{cin}")]
        public async Task<Response?> Create(string cin = "")
        {
            var stopwatch = Stopwatch.StartNew();
            
            try
            {
                _logger.LogInformation($"Create company called with CIN: {cin}");
                
                // Validation
                if (string.IsNullOrWhiteSpace(cin))
                {
                    _logger.LogWarning("Create called with empty CIN");
                    return new Response(false, "CIN is empty");
                }

                // Check if CIN already exists
                Company? existingCompany = _impl.GetByCin(cin, User!.CompanyAdminUserId);
                if (!existingCompany.IsNull())
                {
                    _logger.LogWarning($"CIN '{cin}' already exists for user {User!.CompanyAdminUserId}");
                    return new Response(false, "CIN already exists");
                }

                // Validate entity limits
                string sCompanyRule = ValidateEntityLimitRules();
                if (sCompanyRule != "success")
                {
                    _logger.LogWarning($"Entity limit validation failed for user {User!.CompanyAdminUserId}: {sCompanyRule}");
                    return new Response(false, sCompanyRule);
                }

                // Fetch company data from MCA with retry
                string? mcaResult = await FetchFromMcaApiWithRetry(
                    $"http://45.142.237.183:8080/mca/search?search_type=cin&id={cin}",
                    "Create"
                );

                if (string.IsNullOrEmpty(mcaResult))
                {
                    // Fallback to SurePass
                    _logger.LogWarning($"MCA API failed for CIN '{cin}', attempting SurePass fallback");
                    
                    var requestBody = new { id_number = cin };
                    mcaResult = await _apiLog.HitApi(
                        R.AppSet("SurePass:CinToDetail"), 
                        requestBody, 
                        HttpMethod.Post
                    );

                    if (string.IsNullOrEmpty(mcaResult))
                    {
                        _logger.LogError($"Both MCA and SurePass APIs failed for CIN '{cin}'");
                        return new Response(
                            false, 
                            "Unable to fetch company data from MCA. The service is currently unavailable. Please try again later."
                        );
                    }
                }

                // Parse and save company data
                Company? obj = new Company()
                {
                    Details = new CompanyDetails() { },
                    OtherDetails = new CompanyOtherDetails() { },
                    FinancialDetails = new CompanyFinancialDetails() { }
                };

                obj.RefUser = User!.CompanyAdminUserId;
                obj = _impl.SyncCIN(obj, mcaResult);
                
                if (obj.IsNull())
                {
                    _logger.LogError($"Failed to parse CIN data for '{cin}'");
                    return new Response(false, "Unable to parse company data from MCA");
                }

                if (User == null) User = new AppUser { Id = -1 };
                obj.PreInsert(User!);
                obj.IsDeleted = false;
                obj.CompanyType = obj.CompanyType.ToLower() == "comapny" ? "Entity" : obj.CompanyType;

                // Final check before saving
                Company? obj1 = _impl.GetByCin(cin, User!.CompanyAdminUserId);
                if (!obj1.IsNull())
                {
                    _logger.LogWarning($"CIN '{cin}' was added by another process");
                    return new Response(false, "CIN already exists");
                }

                // Validate limits again
                sCompanyRule = ValidateEntityLimitRules();
                if (sCompanyRule != "success")
                {
                    return new Response(false, sCompanyRule);
                }

                // Save company
                var r = _impl.Save(obj);
                if (r.IsNull())
                {
                    _logger.LogError($"Failed to save company for CIN '{cin}'");
                    return new Response(false, CONST.SaveError);
                }

                _impl.SaveDirectors(r.Id, obj.Directors);
                _impl.SaveCharges(r.Id, obj.Charges);

                stopwatch.Stop();
                _logger.LogInformation($"Company created successfully for CIN '{cin}' in {stopwatch.ElapsedMilliseconds}ms");
                
                return new Response(true, "Company created successfully", r!.Id);
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                _logger.LogError(ex, $"Exception in Create for CIN '{cin}' after {stopwatch.ElapsedMilliseconds}ms");
                return new Response(
                    false, 
                    "An error occurred while creating the company. Please try again later."
                );
            }
        }

        /// <summary>
        /// Helper method to fetch from MCA API with retry and timeout
        /// </summary>
        private async Task<string?> FetchFromMcaApiWithRetry(string url, string operation)
        {
            for (int attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++)
            {
                try
                {
                    var stopwatch = Stopwatch.StartNew();
                    _logger.LogInformation($"MCA API attempt {attempt}/{MAX_RETRY_ATTEMPTS} for {operation}: {url}");

                    using var client = new HttpClient();
                    client.Timeout = TimeSpan.FromSeconds(API_TIMEOUT_SECONDS);

                    var response = await client.GetAsync(url);
                    stopwatch.Stop();

                    if (response.IsSuccessStatusCode)
                    {
                        var content = await response.Content.ReadAsStringAsync();
                        _logger.LogInformation($"MCA API success on attempt {attempt} in {stopwatch.ElapsedMilliseconds}ms");
                        return content;
                    }
                    else
                    {
                        _logger.LogWarning($"MCA API returned {response.StatusCode} on attempt {attempt} after {stopwatch.ElapsedMilliseconds}ms");
                    }
                }
                catch (TaskCanceledException ex)
                {
                    _logger.LogWarning($"MCA API timeout on attempt {attempt} after {API_TIMEOUT_SECONDS}s: {ex.Message}");
                }
                catch (HttpRequestException ex)
                {
                    _logger.LogWarning($"MCA API network error on attempt {attempt}: {ex.Message}");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"MCA API unexpected error on attempt {attempt}");
                }

                // Wait before retry (except on last attempt)
                if (attempt < MAX_RETRY_ATTEMPTS)
                {
                    _logger.LogInformation($"Waiting {RETRY_DELAY_MILLISECONDS}ms before retry...");
                    await Task.Delay(RETRY_DELAY_MILLISECONDS);
                }
            }

            _logger.LogError($"MCA API failed after {MAX_RETRY_ATTEMPTS} attempts for {operation}");
            return null;
        }

        [Authorize(CompanyAdmin: true)]
        [HttpDelete("Delete")]
        public virtual Response? Delete(int id = 0)
        {
            var obj = _impl.GetById(id);
            if (obj.IsNull()) return new Response(false, "Entry not found");
            var r = _impl.Delete(obj!);
            if (r.IsNull())
                return new Response(false, CONST.DeleteError);
            return new Response(true, CONST.DeleteSuccess, obj!);
        }

        [HttpGet("{id}/Status/{status}")]
        public Response? ChangeActiveStatus(int id = 0, bool status = false)
        {
            Company? obj = _impl.GetById(id);
            if (obj.IsNull())
                return new Response(false, "Entry not found");
            obj.IsActive = status;
            var r = _impl.ChangeActiveStatus(obj!);
            if (r.IsNull())
                return new Response(false, CONST.ChangeStatusError);
            return new Response(true, "Successfully " + (status ? "activated" : "disabled"));
        }

        /// <summary>
        /// Sync company data from MCA
        /// IMPROVED: With timeout, retry, error handling
        /// </summary>
        [HttpGet("{id}/Sync")]
        public async Task<Response?> Sync(int id = 0)
        {
            var stopwatch = Stopwatch.StartNew();
            
            try
            {
                _logger.LogInformation($"Sync called for company ID: {id}");
                
                Company? obj = _impl.GetById(id);
                if (obj.IsNull())
                {
                    _logger.LogWarning($"Company not found for ID: {id}");
                    return new Response(false, "Company does not exist");
                }

                // Fetch from MCA with retry
                string? mcaResult = await FetchFromMcaApiWithRetry(
                    $"http://45.142.237.183:8080/mca/search?search_type=cin&id={obj.Cin}",
                    "Sync"
                );

                if (string.IsNullOrEmpty(mcaResult))
                {
                    _logger.LogError($"Failed to sync data for company ID {id}, CIN: {obj.Cin}");
                    return new Response(
                        false, 
                        "Unable to sync company data. The MCA service is currently unavailable."
                    );
                }

                obj = _impl.SyncCIN(obj, mcaResult);
                if (obj.IsNull())
                {
                    _logger.LogError($"Failed to parse sync data for company ID: {id}");
                    return new Response(false, "Error while parsing CIN Data");
                }

                if (User == null) User = new AppUser { Id = -1 };
                obj.PreInsert(User!);
                var r = _impl.Save(obj);
                
                if (r.IsNull())
                {
                    _logger.LogError($"Failed to save synced data for company ID: {id}");
                    return new Response(false, CONST.SaveError);
                }
                
                _impl.SaveDirectors(r.Id, obj.Directors);
                _impl.SaveCharges(r.Id, obj.Charges);

                stopwatch.Stop();
                _logger.LogInformation($"Sync successful for company ID {id} in {stopwatch.ElapsedMilliseconds}ms");
                
                return new Response(true, "Synced Successfully", r);
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                _logger.LogError(ex, $"Exception in Sync for company ID {id} after {stopwatch.ElapsedMilliseconds}ms");
                return new Response(
                    false, 
                    "An error occurred while syncing company data. Please try again later."
                );
            }
        }

        [Authorize]
        [HttpGet("S2")]
        public IEnumerable<CompanyView> AllSelect2(string query = "")
        {
            var list = _impl.GetByUserIdS2(User!.CompanyAdminUserId);
            list = list.Where(u => u.IsActive);
            if (!string.IsNullOrWhiteSpace(query))
                list = list.Where(u => (u.CompanyName?.ToLower().Contains(query.ToLower()) ?? false));
            return list;
        }

        [HttpGet("{id}/charges")]
        public IEnumerable<CompanyIndexCharge> GetCharges(int id)
        {
            return _impl.GetCharges(id);
        }

        [HttpGet("PinCode/{pinCode}")]
        public ActionResult PinCode(string pinCode)
        {
            var a = Http.GetString($@"https://api.postalpincode.in/pincode/{HttpUtility.UrlEncode(pinCode)}");
            return Content(a, "application/json");
        }

        [Authorize]
        [HttpGet("CompanyUsedCount")]
        public ActionResult CompanyUsedCount()
        {
            var used = _userSub.UsedCompanyCount(User!.CompanyAdminUserId);
            var total = _userSub.TotalCompanyCount(User!.CompanyAdminUserId);
            total = total == 0 ? 3 : total;
            var result = $"{used} out of {total}";
            return Content(result, "text/plain");
        }

        /// <summary>
        /// Check if MCA API is reachable
        /// IMPROVED: With better error handling and logging
        /// </summary>
        [HttpGet("IsMCAReachable")]
        public async Task<IActionResult> IsMCAReachable()
        {
            try
            {
                _logger.LogInformation("Checking MCA reachability");
                
                using var client = new HttpClient();
                client.Timeout = TimeSpan.FromSeconds(30);

                var stopwatch = Stopwatch.StartNew();
                var response = await client.GetAsync(R.AppSet("MCA:MCAURL"));
                stopwatch.Stop();

                bool isReachable = response.IsSuccessStatusCode;
                
                _logger.LogInformation($"MCA reachability check: {isReachable} (took {stopwatch.ElapsedMilliseconds}ms)");
                
                return Ok(new 
                { 
                    reachable = isReachable,
                    responseTime = stopwatch.ElapsedMilliseconds,
                    statusCode = (int)response.StatusCode
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "MCA reachability check failed");
                return Ok(new 
                { 
                    reachable = false,
                    error = ex.Message
                });
            }
        }

        [NonAction]
        public string ValidateEntityLimitRules()
        {
            string sMessage = "success";
            if (User! != null)
            {
                int iPlanCompanyCount = _impl.PurchaseCompanyLimit(User!.CompanyAdminUserId);
                int iUsedCompanyCount = _impl.UsedCompanyLimit(User!.CompanyAdminUserId);

                if (iPlanCompanyCount == 0 && iUsedCompanyCount == 0)
                {
                    UserSubscriptionsRepository _iuserSub = new UserSubscriptionsRepository();
                    var vCheckTrialPack = _iuserSub.GetTrialPackInfo(User!.CompanyAdminUserId);
                    if (vCheckTrialPack == null)
                    {
                        UserSubscriptions _us = new UserSubscriptions();
                        _us.SubscriptionId = 1;
                        _us.UserId = User!.CompanyAdminUserId;
                        _us.StartDate = DateTime.Now;
                        _us.EndDate = DateTime.Now.AddDays(13);
                        _us.PurchasedOn = DateTime.Now;
                        _us.IsActive = true;
                        var vTrialPacks = _iuserSub.PurchaseSubscription(_us);
                        if (vTrialPacks == null)
                            sMessage = "Trial activation failed. Please try again, or contact us if the problem continues.";
                    }
                }

                var vTrialPack = _userSub.GetTrialPackInfo(User!.CompanyAdminUserId);
                if (vTrialPack != null)
                {
                    iPlanCompanyCount = iPlanCompanyCount + _impl.TrialCompanyCount(User!.CompanyAdminUserId);

                    if (Convert.ToDateTime(vTrialPack.EndDate.Date).Date == DateTime.Now.Date)
                        sMessage = "Your trial period has ended today. To keep enjoying full access, please upgrade to a subscription plan;";

                    if (iUsedCompanyCount >= iPlanCompanyCount)
                        sMessage = "You're on a free trial! You can add up to " + iPlanCompanyCount +
                            " companies during this period. To add more than " + iPlanCompanyCount + " companies, please upgrade to subscription plan.";
                }
                else
                {
                    if (iPlanCompanyCount > 0 && (iPlanCompanyCount == iUsedCompanyCount || iPlanCompanyCount < iUsedCompanyCount))
                        sMessage = "You've reached your company limit of " + iPlanCompanyCount + ". To continue, please upgrade your subscription plan.";
                }
            }
            else sMessage = "Invalid company add request.";
            return sMessage;
        }
    }
}

