# ComplyCrafter End-to-End Mapping

This document captures how UI forms map to backend repositories, API controllers, and data models across the solution. File paths are relative to the solution root.

## Statutory Form Linkage
Each row groups together the UI Razor views, business-logic repositories, API controllers, and data-layer models that share the same form code. Cells list all matching files (line breaks preserved).

| Form | Phase | UI Views | Business Logic | API Controllers | Data Models | Missing |
| --- | --- | --- | --- | --- | --- |
| ACCOUNTNSOLVENCY | ComplyCrafter_UI/Views/Form/AccountnSolvency.cshtml<br>ComplyCrafter_UI/Views/Form/AccountnSolvencyForm.cshtml | — | ComplyCrafter_API/Controllers/Form/AccountnSolvencyController .cs | — | BL, Data |
| ADT1 | Phase 1 | ComplyCrafter_UI/Views/Form/ADT1.cshtml<br>ComplyCrafter_UI/Views/Form/ADT1Form.cshtml<br>frontend/apps/portal/src/app/forms/adt1/adt1.component.ts | ComplyCrafter_BL/Forms/ADT1Repository.cs<br>services/forms/app/services/adt1_service.py | ComplyCrafter_API/Controllers/Form/ADT1Controller.cs<br>services/forms/app/api/routes/adt1.py | ComplyCrafter_Data/Forms/ADT1.cs<br>services/forms/app/models/adt1.py | — |
| ADT3 | ComplyCrafter_UI/Views/Form/ADT3.cshtml<br>ComplyCrafter_UI/Views/Form/ADT3Form.cshtml | ComplyCrafter_BL/Forms/ADT3Repository.cs | ComplyCrafter_API/Controllers/Form/ADT3Controller.cs | ComplyCrafter_Data/Forms/ADT3.cs | — |
| AOC4 | Phase 3 | ComplyCrafter_UI/Views/Form/AOC4.cshtml<br>ComplyCrafter_UI/Views/Form/AOC4Form.cshtml<br>frontend/apps/portal/src/app/forms/generic-form/phase3-form.component.ts<br>frontend/apps/portal/src/app/forms/generic-form/phase3-form.config.ts | ComplyCrafter_BL/Forms/AOC4Repository.cs<br>services/forms/app/services/json_submission_service.py | ComplyCrafter_API/Controllers/Form/AOC4Controller.cs<br>services/forms/app/api/routes/aoc4.py | ComplyCrafter_Data/Forms/AOC4.cs<br>services/forms/app/models/json_submission.py (Aoc4Submission) | — |
| AOC4CFS | Phase 3 | ComplyCrafter_UI/Views/Form/AOC4CFS.cshtml<br>ComplyCrafter_UI/Views/Form/AOC4CFSForm.cshtml<br>frontend/apps/portal/src/app/forms/generic-form/phase3-form.component.ts<br>frontend/apps/portal/src/app/forms/generic-form/phase3-form.config.ts | ComplyCrafter_BL/Forms/AOC4CFSRepository.cs<br>services/forms/app/services/json_submission_service.py | ComplyCrafter_API/Controllers/Form/AOC4CFSController.cs<br>services/forms/app/api/routes/aoc4cfs.py | ComplyCrafter_Data/Forms/AOC4CFS.cs<br>services/forms/app/models/json_submission.py (Aoc4cfsSubmission) | — |
| AOC4CFSCHILD | — | — | — | ComplyCrafter_Data/Forms/AOC4CFSCHILD.cs | UI, BL, API |
| AOC5 | ComplyCrafter_UI/Views/Form/AOC5.cshtml<br>ComplyCrafter_UI/Views/Form/AOC5Form.cshtml | ComplyCrafter_BL/Forms/AOC5Repository.cs | ComplyCrafter_API/Controllers/Form/AOC5Controllercs.cs | ComplyCrafter_Data/Forms/AOC5.cs | — |
| AOCCUNTNSOLVENCYFORM | — | ComplyCrafter_BL/Forms/AOCCUNTNSOLVENCYFORMRepository .cs | — | ComplyCrafter_Data/Forms/AoccuntnSolvencyForm.cs | UI, API |
| BEN2 | Phase 2 | ComplyCrafter_UI/Views/Form/BEN2.cshtml<br>ComplyCrafter_UI/Views/Form/BEN2Form.cshtml<br>frontend/apps/portal/src/app/forms/ben2/ben2.component.ts | ComplyCrafter_BL/Forms/BEN2Repository.cs<br>services/forms/app/services/ben2_service.py | ComplyCrafter_API/Controllers/Form/BEN2Controller.cs<br>services/forms/app/api/routes/ben2.py | ComplyCrafter_Data/Forms/BEN2.cs<br>services/forms/app/models/ben2.py | — |
| BOARDREPORT | ComplyCrafter_UI/Views/Form/boardreport.cshtml<br>ComplyCrafter_UI/Views/Form/boardreportForm.cshtml | ComplyCrafter_BL/Forms/BOARDREPORTRepository.cs | ComplyCrafter_API/Controllers/Form/BOARDREPORTController.cs | ComplyCrafter_Data/Forms/BOARDREPORT.cs | — |
| CHARGE | ComplyCrafter_UI/Views/Form/CHARGE.cshtml<br>ComplyCrafter_UI/Views/Form/CHARGEForm.cshtml | ComplyCrafter_BL/Forms/CHARGERepository .cs | ComplyCrafter_API/Controllers/Form/CHARGEController.cs | ComplyCrafter_Data/Forms/CHARGE.cs | — |
| CHG1 | ComplyCrafter_UI/Views/Form/CHG1.cshtml<br>ComplyCrafter_UI/Views/Form/CHG1Form.cshtml | ComplyCrafter_BL/Forms/CHG1Repository.cs | ComplyCrafter_API/Controllers/Form/CHG1Controller.cs | ComplyCrafter_Data/Forms/CHG1.cs | — |
| CHG4 | ComplyCrafter_UI/Views/Form/CHG4.cshtml<br>ComplyCrafter_UI/Views/Form/CHG4Form.cshtml | ComplyCrafter_BL/Forms/CHG4Repository.cs | ComplyCrafter_API/Controllers/Form/CHG4Controller.cs | ComplyCrafter_Data/Forms/CHG4.cs | — |
| CHG6 | ComplyCrafter_UI/Views/Form/CHG6.cshtml<br>ComplyCrafter_UI/Views/Form/CHG6Form.cshtml | ComplyCrafter_BL/Forms/CHG6Repository.cs | ComplyCrafter_API/Controllers/Form/CHG6Controller.cs | ComplyCrafter_Data/Forms/CHG6.cs | — |
| CHG8 | ComplyCrafter_UI/Views/Form/CHG8.cshtml<br>ComplyCrafter_UI/Views/Form/CHG8Form.cshtml | ComplyCrafter_BL/Forms/CHG8Repository.cs | ComplyCrafter_API/Controllers/Form/CHG8Controller.cs | ComplyCrafter_Data/Forms/CHG8.cs | — |
| CHG9 | ComplyCrafter_UI/Views/Form/CHG9.cshtml<br>ComplyCrafter_UI/Views/Form/CHG9Form.cshtml | ComplyCrafter_BL/Forms/CHG9Repository.cs | ComplyCrafter_API/Controllers/Form/CHG9Controller.cs | ComplyCrafter_Data/Forms/CHG9.cs | — |
| DIR11 | ComplyCrafter_UI/Views/Form/DIR11.cshtml<br>ComplyCrafter_UI/Views/Form/DIR11Form.cshtml | ComplyCrafter_BL/Forms/DIR11Repository.cs | ComplyCrafter_API/Controllers/Form/DIR11Controller.cs | ComplyCrafter_Data/Forms/DIR11.cs | — |
| DIR12 | ComplyCrafter_UI/Views/Form/DIR12.cshtml<br>ComplyCrafter_UI/Views/Form/DIR12Form.cshtml | ComplyCrafter_BL/Forms/DIR12Repository.cs | ComplyCrafter_API/Controllers/Form/DIR12Controller.cs | ComplyCrafter_Data/Forms/DIR12.cs | — |
| DIR3 | ComplyCrafter_UI/Views/Form/DIR3.cshtml<br>ComplyCrafter_UI/Views/Form/DIR3Form.cshtml | ComplyCrafter_BL/Forms/DIR3Repository.cs | ComplyCrafter_API/Controllers/Form/DIR3Controller.cs | ComplyCrafter_Data/Forms/DIR3.cs | — |
| DIR5 | ComplyCrafter_UI/Views/Form/DIR5.cshtml<br>ComplyCrafter_UI/Views/Form/DIR5Form.cshtml | ComplyCrafter_BL/Forms/DIR5Repository.cs | ComplyCrafter_API/Controllers/Form/DIR5Controller.cs | ComplyCrafter_Data/Forms/DIR5.cs | — |
| DIR6 | ComplyCrafter_UI/Views/Form/DIR6.cshtml<br>ComplyCrafter_UI/Views/Form/DIR6Form.cshtml | ComplyCrafter_BL/Forms/DIR6Repository.cs | ComplyCrafter_API/Controllers/Form/DIR6Controller.cs | ComplyCrafter_Data/Forms/DIR6.cs | — |
| DIR9 | ComplyCrafter_UI/Views/Form/DIR9.cshtml<br>ComplyCrafter_UI/Views/Form/DIR9Form.cshtml | ComplyCrafter_BL/Forms/DIR9Repository.cs | ComplyCrafter_API/Controllers/Form/DIR9Controller.cs | ComplyCrafter_Data/Forms/DIR9.cs | — |
| DPT3 | Phase 2 | ComplyCrafter_UI/Views/Form/DPT3.cshtml<br>ComplyCrafter_UI/Views/Form/DPT3Form.cshtml<br>frontend/apps/portal/src/app/forms/dpt3/dpt3.component.ts | ComplyCrafter_BL/Forms/DPT3Repository.cs<br>services/forms/app/services/dpt3_service.py | ComplyCrafter_API/Controllers/Form/DPT3Controller.cs<br>services/forms/app/api/routes/dpt3.py | ComplyCrafter_Data/Forms/DPT3.cs<br>services/forms/app/models/dpt3.py | — |
| DPT4 | ComplyCrafter_UI/Views/Form/DPT4.cshtml<br>ComplyCrafter_UI/Views/Form/DPT4Form.cshtml | — | — | — | BL, API, Data |
| FORM11 | ComplyCrafter_UI/Views/Form/Form11.cshtml<br>ComplyCrafter_UI/Views/Form/Form11Form.cshtml | ComplyCrafter_BL/Forms/FORM11Repository.cs | ComplyCrafter_API/Controllers/Form/FORM11Controller.cs | ComplyCrafter_Data/Forms/FORM11.cs | — |
| FORM12 | ComplyCrafter_UI/Views/Form/Form12.cshtml<br>ComplyCrafter_UI/Views/Form/Form12Form.cshtml | ComplyCrafter_BL/Forms/FORM12Repository.cs | ComplyCrafter_API/Controllers/Form/FORM12Controller.cs | ComplyCrafter_Data/Forms/FORM12.cs | — |
| FORM15 | ComplyCrafter_UI/Views/Form/Form15.cshtml<br>ComplyCrafter_UI/Views/Form/Form15Form.cshtml | ComplyCrafter_BL/Forms/FORM15Repository.cs | ComplyCrafter_API/Controllers/Form/FORM15Controller.cs | ComplyCrafter_Data/Forms/FORM15.cs | — |
| FORM22 | ComplyCrafter_UI/Views/Form/Form22.cshtml<br>ComplyCrafter_UI/Views/Form/Form22Form.cshtml | ComplyCrafter_BL/Forms/FORM22Repository.cs | ComplyCrafter_API/Controllers/Form/FORM22Controller.cs | ComplyCrafter_Data/Forms/FORM22.cs | — |
| FORM23 | ComplyCrafter_UI/Views/Form/Form23.cshtml<br>ComplyCrafter_UI/Views/Form/Form23Form.cshtml | ComplyCrafter_BL/Forms/FORM23Repository.cs | ComplyCrafter_API/Controllers/Form/FORM23Controller.cs | ComplyCrafter_Data/Forms/FORM23.cs | — |
| FORM24 | ComplyCrafter_UI/Views/Form/Form24.cshtml<br>ComplyCrafter_UI/Views/Form/Form24Form.cshtml | ComplyCrafter_BL/Forms/FORM24Repository.cs | ComplyCrafter_API/Controllers/Form/FORM24Controller.cs | ComplyCrafter_Data/Forms/FORM24.cs | — |
| FORM3 | ComplyCrafter_UI/Views/Form/Form3.cshtml<br>ComplyCrafter_UI/Views/Form/Form3Form.cshtml | ComplyCrafter_BL/Forms/FORM3Repository .cs | ComplyCrafter_API/Controllers/Form/FORM3Controller .cs | ComplyCrafter_Data/Forms/Form3.cs | — |
| FORM4 | ComplyCrafter_UI/Views/Form/Form4.cshtml<br>ComplyCrafter_UI/Views/Form/Form4Form.cshtml | ComplyCrafter_BL/Forms/FORM4Repository.cs | ComplyCrafter_API/Controllers/Form/FORM4Controller.cs | ComplyCrafter_Data/Forms/Form4.cs | — |
| FORM5 | ComplyCrafter_UI/Views/Form/Form5.cshtml<br>ComplyCrafter_UI/Views/Form/Form5Form.cshtml | ComplyCrafter_BL/Forms/FORM5Repository .cs | ComplyCrafter_API/Controllers/Form/FORM5Controller .cs | ComplyCrafter_Data/Forms/FORM5.cs | — |
| GNL1 | ComplyCrafter_UI/Views/Form/GNL1.cshtml<br>ComplyCrafter_UI/Views/Form/GNL1Form.cshtml | ComplyCrafter_BL/Forms/GNL1Repository.cs | ComplyCrafter_API/Controllers/Form/GNL1Controller.cs | ComplyCrafter_Data/Forms/GNL1.cs | — |
| GNL2 | ComplyCrafter_UI/Views/Form/GNL2.cshtml<br>ComplyCrafter_UI/Views/Form/GNL2Form.cshtml | ComplyCrafter_BL/Forms/GNL2Repository.cs | ComplyCrafter_API/Controllers/Form/GNL2Controller.cs | ComplyCrafter_Data/Forms/GNL2.cs | — |
| GNL3 | ComplyCrafter_UI/Views/Form/GNL3.cshtml<br>ComplyCrafter_UI/Views/Form/GNL3Form.cshtml | ComplyCrafter_BL/Forms/GNL3Repository.cs | ComplyCrafter_API/Controllers/Form/GNL3Controller .cs | ComplyCrafter_Data/Forms/GNL3.cs | — |
| IEPF2 | ComplyCrafter_UI/Views/Form/IEPF2.cshtml<br>ComplyCrafter_UI/Views/Form/IEPF2Form.cshtml | ComplyCrafter_BL/Forms/IEPF2Repository.cs | ComplyCrafter_API/Controllers/Form/IEPF2Controller.cs | ComplyCrafter_Data/Forms/IEPF2.cs | — |
| IEPF5 | ComplyCrafter_UI/Views/Form/IEPF5.cshtml<br>ComplyCrafter_UI/Views/Form/IEPF5Form.cshtml | ComplyCrafter_BL/Forms/IEPF5Repositorycs.cs | ComplyCrafter_API/Controllers/Form/IEPF5Controller.cs | ComplyCrafter_Data/Forms/IEPF5.cs | — |
| INC12 | ComplyCrafter_UI/Views/Form/INC12.cshtml<br>ComplyCrafter_UI/Views/Form/INC12Form.cshtml | ComplyCrafter_BL/Forms/INC12Repository.cs | ComplyCrafter_API/Controllers/Form/INC12Controller.cs | ComplyCrafter_Data/Forms/INC12.cs | — |
| INC20A | ComplyCrafter_UI/Views/Form/INC20A.cshtml<br>ComplyCrafter_UI/Views/Form/INC20AForm.cshtml | ComplyCrafter_BL/Forms/INC20ARepository.cs | ComplyCrafter_API/Controllers/Form/INC20AController.cs | ComplyCrafter_Data/Forms/INC20A.cs | — |
| INC22 | ComplyCrafter_UI/Views/Form/INC22.cshtml<br>ComplyCrafter_UI/Views/Form/INC22Form.cshtml | ComplyCrafter_BL/Forms/INC22Repository.cs | ComplyCrafter_API/Controllers/Form/INC22Controller.cs | ComplyCrafter_Data/Forms/INC22.cs | — |
| INC23 | ComplyCrafter_UI/Views/Form/INC23.cshtml<br>ComplyCrafter_UI/Views/Form/INC23Form.cshtml | ComplyCrafter_BL/Forms/INC23Repository.cs | ComplyCrafter_API/Controllers/Form/INC23Controller.cs | ComplyCrafter_Data/Forms/INC23.cs | — |
| INC24 | ComplyCrafter_UI/Views/Form/INC24.cshtml<br>ComplyCrafter_UI/Views/Form/INC24Form.cshtml | ComplyCrafter_BL/Forms/INC24Repository.cs | ComplyCrafter_API/Controllers/Form/INC24Controller.cs | ComplyCrafter_Data/Forms/INC24.cs | — |
| INC28 | ComplyCrafter_UI/Views/Form/INC28.cshtml<br>ComplyCrafter_UI/Views/Form/INC28Form.cshtml | ComplyCrafter_BL/Forms/INC28Repository.cs | ComplyCrafter_API/Controllers/Form/INC28Controller.cs | ComplyCrafter_Data/Forms/INC28.cs | — |
| INC4 | ComplyCrafter_UI/Views/Form/INC4.cshtml<br>ComplyCrafter_UI/Views/Form/INC4Form.cshtml | ComplyCrafter_BL/Forms/INC4Repository.cs | ComplyCrafter_API/Controllers/Form/INC4Controller.cs | ComplyCrafter_Data/Forms/INC4.cs | — |
| MGT14 | ComplyCrafter_UI/Views/Form/MGT14.cshtml<br>ComplyCrafter_UI/Views/Form/MGT14Form.cshtml | ComplyCrafter_BL/Forms/MGT14Repository.cs | ComplyCrafter_API/Controllers/Form/MGT14Controller .cs | ComplyCrafter_Data/Forms/MGT14.cs | — |
| MGT6 | ComplyCrafter_UI/Views/Form/MGT6.cshtml<br>ComplyCrafter_UI/Views/Form/MGT6Form.cshtml | ComplyCrafter_BL/Forms/MGT6Repository.cs | ComplyCrafter_API/Controllers/Form/MGT6Controller.cs | ComplyCrafter_Data/Forms/MGT6.cs | — |
| MGT7A | Phase 3 | ComplyCrafter_UI/Views/Form/MGT7A.cshtml<br>ComplyCrafter_UI/Views/Form/MGT7AForm.cshtml<br>frontend/apps/portal/src/app/forms/generic-form/phase3-form.component.ts<br>frontend/apps/portal/src/app/forms/generic-form/phase3-form.config.ts | ComplyCrafter_BL/Forms/MGT7ARepository.cs<br>services/forms/app/services/json_submission_service.py | ComplyCrafter_API/Controllers/Form/MGT7AController.cs<br>services/forms/app/api/routes/mgt7a.py | ComplyCrafter_Data/Forms/MGT7A.cs<br>services/forms/app/models/json_submission.py (Mgt7aSubmission) | — |
| MGT8 | ComplyCrafter_UI/Views/Form/MGT8.cshtml<br>ComplyCrafter_UI/Views/Form/MGT8Form.cshtml | ComplyCrafter_BL/Forms/MGT8Repository.cs | ComplyCrafter_API/Controllers/Form/MGT8Controller.cs | ComplyCrafter_Data/Forms/MGT8.cs | — |
| MGT9 | ComplyCrafter_UI/Views/Form/MGT9.cshtml<br>ComplyCrafter_UI/Views/Form/MGT9Form.cshtml | ComplyCrafter_BL/Forms/MGT9Repository.cs | ComplyCrafter_API/Controllers/Form/MGT9Controller.cs | ComplyCrafter_Data/Forms/MGT9.cs | — |
| MR1 | ComplyCrafter_UI/Views/Form/MR1.cshtml<br>ComplyCrafter_UI/Views/Form/MR1Form.cshtml | ComplyCrafter_BL/Forms/MR1Repository.cs | ComplyCrafter_API/Controllers/Form/MR1Controller.cs | ComplyCrafter_Data/Forms/MR1.cs | — |
| MSC3 | ComplyCrafter_UI/Views/Form/MSC3.cshtml<br>ComplyCrafter_UI/Views/Form/MSC3Form.cshtml | — | — | — | BL, API, Data |
| MSME | Phase 3 | ComplyCrafter_UI/Views/Form/MSME.cshtml<br>ComplyCrafter_UI/Views/Form/MSMEForm.cshtml<br>frontend/apps/portal/src/app/forms/generic-form/phase3-form.component.ts<br>frontend/apps/portal/src/app/forms/generic-form/phase3-form.config.ts | ComplyCrafter_BL/Forms/MSMERespositry.cs<br>services/forms/app/services/json_submission_service.py | ComplyCrafter_API/Controllers/Form/MSMEController.cs<br>services/forms/app/api/routes/msme.py | ComplyCrafter_Data/Forms/MSME.cs<br>services/forms/app/models/json_submission.py (MsmeSubmission) | — |
| MSME1 | Phase 3 | ComplyCrafter_UI/Views/Form/MSME1.cshtml<br>ComplyCrafter_UI/Views/Form/MSME1Form.cshtml<br>frontend/apps/portal/src/app/forms/generic-form/phase3-form.component.ts<br>frontend/apps/portal/src/app/forms/generic-form/phase3-form.config.ts | services/forms/app/services/json_submission_service.py | services/forms/app/api/routes/msme1.py | services/forms/app/models/json_submission.py (Msme1Submission) | — |
| MSMERESPOSITRY | — | ComplyCrafter_BL/Forms/MSMERespositry.cs | — | — | UI, API, Data |
| NDH1 | Phase 3 | ComplyCrafter_UI/Views/Form/NDH1.cshtml<br>frontend/apps/portal/src/app/forms/generic-form/phase3-form.component.ts<br>frontend/apps/portal/src/app/forms/generic-form/phase3-form.config.ts | services/forms/app/services/json_submission_service.py | services/forms/app/api/routes/ndh1.py | services/forms/app/models/json_submission.py (Ndh1Submission) | — |
| NDH2 | Phase 3 | ComplyCrafter_UI/Views/Form/NDH2.cshtml<br>frontend/apps/portal/src/app/forms/generic-form/phase3-form.component.ts<br>frontend/apps/portal/src/app/forms/generic-form/phase3-form.config.ts | services/forms/app/services/json_submission_service.py | services/forms/app/api/routes/ndh2.py | services/forms/app/models/json_submission.py (Ndh2Submission) | — |
| PAS2 | ComplyCrafter_UI/Views/Form/PAS2.cshtml<br>ComplyCrafter_UI/Views/Form/PAS2Form.cshtml | — | — | — | BL, API, Data |
| PAS3 | Phase 2 | ComplyCrafter_UI/Views/Form/PAS3.cshtml<br>ComplyCrafter_UI/Views/Form/PAS3Form.cshtml<br>frontend/apps/portal/src/app/forms/pas3/pas3.component.ts | ComplyCrafter_BL/Forms/PAS3Repository.cs<br>services/forms/app/services/pas3_service.py | ComplyCrafter_API/Controllers/Form/PAS3Controller.cs<br>services/forms/app/api/routes/pas3.py | ComplyCrafter_Data/Forms/PAS3.cs<br>services/forms/app/models/pas3.py | — |
| PAS6 | ComplyCrafter_UI/Views/Form/PAS6.cshtml<br>ComplyCrafter_UI/Views/Form/PAS6Form.cshtml | ComplyCrafter_BL/Forms/PAS6Repository.cs | ComplyCrafter_API/Controllers/Form/PAS6Controller.cs | ComplyCrafter_Data/Forms/PAS6.cs | — |
| RUN | ComplyCrafter_UI/Views/Form/RUN.cshtml<br>ComplyCrafter_UI/Views/Form/RUNForm.cshtml | ComplyCrafter_BL/Forms/RUNRepository.cs | ComplyCrafter_API/Controllers/Form/RUNController.cs | ComplyCrafter_Data/Forms/RUN.cs | — |
| RUNLLP | ComplyCrafter_UI/Views/Form/RUNLLP.cshtml<br>ComplyCrafter_UI/Views/Form/RUNLLPForm.cshtml | ComplyCrafter_BL/Forms/RUNLLPRepository.cs | ComplyCrafter_API/Controllers/Form/RUNLLPController.cs | ComplyCrafter_Data/Forms/RUNLLP.cs | — |
| SH11 | ComplyCrafter_UI/Views/Form/SH11.cshtml<br>ComplyCrafter_UI/Views/Form/SH11Form.cshtml | ComplyCrafter_BL/Forms/SH11Repository.cs | ComplyCrafter_API/Controllers/Form/SH11Controller.cs | ComplyCrafter_Data/Forms/SH11.cs | — |
| SH7 | ComplyCrafter_UI/Views/Form/SH7.cshtml<br>ComplyCrafter_UI/Views/Form/SH7Form.cshtml | ComplyCrafter_BL/Forms/SH7Repository.cs | ComplyCrafter_API/Controllers/Form/SH7Controller.cs | ComplyCrafter_Data/Forms/SH7.cs | — |
| SH7SHARE | — | — | — | ComplyCrafter_Data/Forms/SH7Share.cs | UI, BL, API |
| SH7STRUCTURE | — | — | — | ComplyCrafter_Data/Forms/SH7Structure.cs | UI, BL, API |
| SH8 | ComplyCrafter_UI/Views/Form/SH8.cshtml<br>ComplyCrafter_UI/Views/Form/SH8Form.cshtml | ComplyCrafter_BL/Forms/SH8Repository.cs | ComplyCrafter_API/Controllers/Form/SH8Controller.cs | ComplyCrafter_Data/Forms/SH8.cs | — |
| SH9 | ComplyCrafter_UI/Views/Form/SH9.cshtml<br>ComplyCrafter_UI/Views/Form/SH9Form.cshtml | ComplyCrafter_BL/Forms/SH9Repository.cs | ComplyCrafter_API/Controllers/Form/SH9Controller.cs | ComplyCrafter_Data/Forms/SH9.cs | — |
| STK2 | ComplyCrafter_UI/Views/Form/STK2.cshtml<br>ComplyCrafter_UI/Views/Form/STK2Form.cshtml | ComplyCrafter_BL/Forms/STK2Repository.cs | ComplyCrafter_API/Controllers/Form/STK2Controller.cs | ComplyCrafter_Data/Forms/STK2.cs | — |

### Forms Requiring Attention
- **ACCOUNTNSOLVENCY** → Missing layers: BL, Data
- **AOC4CFSCHILD** → Missing layers: UI, BL, API
- **AOCCUNTNSOLVENCYFORM** → Missing layers: UI, API
- **DPT4** → Missing layers: BL, API, Data
- **MSC3** → Missing layers: BL, API, Data
- **MSME** → Missing layers: BL
- **MSME1** → Missing layers: BL, API, Data
- **MSMERESPOSITRY** → Missing layers: UI, API, Data
- **NDH1** → Missing layers: BL, API, Data
- **NDH2** → Missing layers: BL, API, Data
- **PAS2** → Missing layers: BL, API, Data
- **SH7SHARE** → Missing layers: UI, BL, API
- **SH7STRUCTURE** → Missing layers: UI, BL, API

## Core Domain Linkage
This table captures broader UI workflows (Home/Actions/Resolutions/etc.) linked to their supporting business logic, APIs, and data models. Only rows with coverage in two or more layers are shown.

| Domain | UI Views | Business Logic | API Controllers | Data Models |
| --- | --- | --- | --- | --- |
| APILOG | — | ComplyCrafter_BL/ApiLogRepository.cs | — | ComplyCrafter_Data/ApiLog.cs |
| AUDITOR | ComplyCrafter_UI/Views/Home/Auditor.cshtml | ComplyCrafter_BL/AuditorRepository.cs | ComplyCrafter_API/Controllers/AuditorController.cs | ComplyCrafter_Data/Auditor.cs |
| CAPITAL | ComplyCrafter_UI/Views/Home/Capital.cshtml | ComplyCrafter_BL/CapitalRepository.cs | ComplyCrafter_API/Controllers/CapitalController.cs | ComplyCrafter_Data/Capital.cs |
| CLASSMASTER | — | — | ComplyCrafter_API/Controllers/ClassMasterController.cs | ComplyCrafter_Data/ClassMaster.cs |
| COMPANY | ComplyCrafter_UI/Views/Home/Company.cshtml | ComplyCrafter_BL/CompanyRepository.cs | ComplyCrafter_API/Controllers/CompanyController.cs | ComplyCrafter_Data/Company.cs |
| COMPANYNOTICE | ComplyCrafter_UI/Views/Home/CompanyNotice.cshtml | ComplyCrafter_BL/CompanyNoticeRepository.cs | ComplyCrafter_API/Controllers/CompanyNoticeController.cs | ComplyCrafter_Data/CompanyNotice.cs |
| CUSTOMEMAIL | — | ComplyCrafter_BL/CustomEmailRepository.cs | ComplyCrafter_API/Controllers/CustomEmailController.cs | — |
| DEBENTURE | ComplyCrafter_UI/Views/Home/Debenture.cshtml | ComplyCrafter_BL/DebentureRepository.cs | ComplyCrafter_API/Controllers/DebentureController.cs | ComplyCrafter_Data/Debenture.cs |
| DIRECTOR | ComplyCrafter_UI/Views/Home/Director.cshtml | ComplyCrafter_BL/DirectorRepository.cs | ComplyCrafter_API/Controllers/DirectorController.cs | ComplyCrafter_Data/Director.cs |
| DMS | ComplyCrafter_UI/Views/Customer/DMS.cshtml<br>ComplyCrafter_UI/Views/Home/DMS.cshtml | ComplyCrafter_BL/DMSRepository.cs | ComplyCrafter_API/Controllers/DMSController.cs | ComplyCrafter_Data/DMS.cs |
| DPT4 | — | ComplyCrafter_BL/DPT4Repository.cs | ComplyCrafter_API/Controllers/DPT4Controller.cs | ComplyCrafter_Data/DPT4.cs |
| EMAILTRACKER | — | ComplyCrafter_BL/EmailTrackerRepository.cs | — | ComplyCrafter_Data/EmailTracker.cs |
| ENCRYPTDECRYPT | — | ComplyCrafter_BL/EncryptDecrypt.cs | ComplyCrafter_API/Controllers/EncryptDecryptController.cs | — |
| LOGINTRACKER | — | ComplyCrafter_BL/LoginTrackerRepository.cs | — | ComplyCrafter_Data/LoginTracker.cs |
| MEETING | ComplyCrafter_UI/Views/Home/Meeting.cshtml | ComplyCrafter_BL/MeetingRepository.cs | ComplyCrafter_API/Controllers/MeetingController.cs | ComplyCrafter_Data/Meeting.cs |
| MEETINGAGENDADETAIL | — | ComplyCrafter_BL/MeetingAgendaDetailRepository.cs | ComplyCrafter_API/Controllers/MeetingAgendaDetailController.cs | ComplyCrafter_Data/MeetingAgendaDetail.cs |
| OTHERAUDITOR | ComplyCrafter_UI/Views/Home/OtherAuditor.cshtml | ComplyCrafter_BL/OtherAuditorRepository.cs | ComplyCrafter_API/Controllers/OtherAuditorController.cs | ComplyCrafter_Data/OtherAuditor.cs |
| PAYMENTDETAILS | — | ComplyCrafter_BL/PaymentDetailsRepository.cs | — | ComplyCrafter_Data/PaymentDetails.cs |
| RESOLUTION | ComplyCrafter_UI/Views/Home/Resolution.cshtml | ComplyCrafter_BL/ResolutionRepository.cs | ComplyCrafter_API/Controllers/ResolutionController.cs | ComplyCrafter_Data/Resolution.cs |
| SHAREHOLDER | ComplyCrafter_UI/Views/Home/Shareholder.cshtml | ComplyCrafter_BL/ShareholderRepository.cs | ComplyCrafter_API/Controllers/ShareholderController.cs | ComplyCrafter_Data/Shareholder.cs |
| SHAREHOLDERMANAGEMENT | ComplyCrafter_UI/Views/Home/ShareholderManagement.cshtml | ComplyCrafter_BL/ShareholderManagementRepository.cs | ComplyCrafter_API/Controllers/ShareholderManagementController.cs | ComplyCrafter_Data/ShareholderManagement.cs |
| SUBSCRIPTIONPLANS | — | ComplyCrafter_BL/SubscriptionPlansRepository.cs | ComplyCrafter_API/Controllers/SubscriptionPlansController.cs | ComplyCrafter_Data/SubscriptionPlans.cs |
| USER | — | ComplyCrafter_BL/UserRepository.cs | ComplyCrafter_API/Controllers/UserController.cs | — |
| USERSUBSCRIPTIONS | — | ComplyCrafter_BL/UserSubscriptionsRepository.cs | — | ComplyCrafter_Data/UserSubscriptions.cs |

_Generated automatically; update by re-running the helper script in `Resources`._

## Field Inventory Export
- `Resources/field_inventory.json` enumerates every `public` auto-property discovered in the statutory form DTOs (`ComplyCrafter_Data/Forms`) and in the core data models (`ComplyCrafter_Data/*.cs`).
- Use this JSON when you need the raw field lists for documentation, migrations, or validation scaffolding without having to re-parse the C# sources.
