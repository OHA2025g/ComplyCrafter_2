"""
Comprehensive test suite for all migrated forms
Tests all form endpoints, models, and business logic
"""

import pytest
import json
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import get_db, Base
from app.models.auth import User
from app.models.charge import Charge
from app.models.adt1 import ADT1
from app.models.dpt4 import DPT4
from app.models.gnl1 import GNL1
from app.models.iepf2 import IEPF2
from app.models.inc4 import INC4
from app.models.mgt6 import MGT6
from app.models.run import RUN
from app.models.stk2 import STK2
from app.models.form3 import Form3
from app.models.mr1 import MR1
from app.models.boardreport import BOARDREPORT

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# Test data
test_user = {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "is_active": True
}

test_company = {
    "id": 1,
    "cin": "U12345MH2024PTC123456",
    "name": "Test Company Ltd",
    "address": "123 Test Street, Mumbai",
    "email": "test@company.com"
}

class TestFormMigration:
    """Test suite for all migrated forms"""
    
    def setup_method(self):
        """Setup test database and data"""
        Base.metadata.create_all(bind=engine)
        # Create test user and company data
        # This would be done through proper setup methods
    
    def teardown_method(self):
        """Cleanup test database"""
        Base.metadata.drop_all(bind=engine)
    
    def test_charge_form_crud(self):
        """Test CHARGE form CRUD operations"""
        # Test create
        charge_data = {
            "company_id": 1,
            "cin": "U12345MH2024PTC123456",
            "company_name": "Test Company Ltd",
            "company_address": "123 Test Street, Mumbai",
            "company_email": "test@company.com",
            "purpose": "Charge",
            "name_of_charge_holder": "Test Bank",
            "maximum_amount_secured_charge": "1000000",
            "rate_of_interest": "12%",
            "repayment_term": "5 years"
        }
        
        response = client.post("/charge/", json=charge_data)
        assert response.status_code == 201
        charge_id = response.json()["id"]
        
        # Test read
        response = client.get(f"/charge/{charge_id}")
        assert response.status_code == 200
        assert response.json()["name_of_charge_holder"] == "Test Bank"
        
        # Test update
        update_data = {"rate_of_interest": "15%"}
        response = client.put(f"/charge/{charge_id}", json=update_data)
        assert response.status_code == 200
        assert response.json()["rate_of_interest"] == "15%"
        
        # Test list
        response = client.get("/charge/")
        assert response.status_code == 200
        assert len(response.json()) >= 1
        
        # Test delete
        response = client.delete(f"/charge/{charge_id}")
        assert response.status_code == 204
    
    def test_adt1_form_crud(self):
        """Test ADT1 form CRUD operations"""
        adt1_data = {
            "company_id": 1,
            "cin": "U12345MH2024PTC123456",
            "company_name": "Test Company Ltd",
            "company_address": "123 Test Street, Mumbai",
            "company_email": "test@company.com",
            "auditor_name": "Test Auditor",
            "auditor_address": "456 Auditor Street",
            "auditor_email": "auditor@test.com",
            "appointment_date": "2024-01-01",
            "appointment_nature": "FABD"
        }
        
        response = client.post("/adt1/", json=adt1_data)
        assert response.status_code == 201
        adt1_id = response.json()["id"]
        
        response = client.get(f"/adt1/{adt1_id}")
        assert response.status_code == 200
        assert response.json()["auditor_name"] == "Test Auditor"
    
    def test_dpt4_form_crud(self):
        """Test DPT4 form CRUD operations"""
        dpt4_data = {
            "company_id": 1,
            "cin": "U12345MH2024PTC123456",
            "company_name": "Test Company Ltd",
            "company_address": "123 Test Street, Mumbai",
            "company_email": "test@company.com",
            "deposit_amount": "500000",
            "deposit_type": "Fixed Deposit",
            "deposit_date": "2024-01-01",
            "maturity_date": "2025-01-01"
        }
        
        response = client.post("/dpt4/", json=dpt4_data)
        assert response.status_code == 201
        dpt4_id = response.json()["id"]
        
        response = client.get(f"/dpt4/{dpt4_id}")
        assert response.status_code == 200
        assert response.json()["deposit_amount"] == "500000"
    
    def test_gnl1_form_crud(self):
        """Test GNL1 form CRUD operations"""
        gnl1_data = {
            "company_id": 1,
            "cin": "U12345MH2024PTC123456",
            "company_name": "Test Company Ltd",
            "company_address": "123 Test Street, Mumbai",
            "company_email": "test@company.com",
            "general_purpose": "Annual Return",
            "filing_date": "2024-01-01",
            "financial_year": "2023-24"
        }
        
        response = client.post("/gnl1/", json=gnl1_data)
        assert response.status_code == 201
        gnl1_id = response.json()["id"]
        
        response = client.get(f"/gnl1/{gnl1_id}")
        assert response.status_code == 200
        assert response.json()["general_purpose"] == "Annual Return"
    
    def test_iepf2_form_crud(self):
        """Test IEPF2 form CRUD operations"""
        iepf2_data = {
            "company_id": 1,
            "cin": "U12345MH2024PTC123456",
            "company_name": "Test Company Ltd",
            "company_address": "123 Test Street, Mumbai",
            "company_email": "test@company.com",
            "purpose": "Statement of unclaimed and unpaid amounts",
            "unpaid_amount": "100000",
            "filing_date": "2024-01-01"
        }
        
        response = client.post("/iepf2/", json=iepf2_data)
        assert response.status_code == 201
        iepf2_id = response.json()["id"]
        
        response = client.get(f"/iepf2/{iepf2_id}")
        assert response.status_code == 200
        assert response.json()["purpose"] == "Statement of unclaimed and unpaid amounts"
    
    def test_inc4_form_crud(self):
        """Test INC4 form CRUD operations"""
        inc4_data = {
            "company_id": 1,
            "cin": "U12345MH2024PTC123456",
            "company_name": "Test Company Ltd",
            "company_address": "123 Test Street, Mumbai",
            "company_email": "test@company.com",
            "incorporation_purpose": "New Company",
            "incorporation_date": "2024-01-01",
            "authorized_capital": "1000000"
        }
        
        response = client.post("/inc4/", json=inc4_data)
        assert response.status_code == 201
        inc4_id = response.json()["id"]
        
        response = client.get(f"/inc4/{inc4_id}")
        assert response.status_code == 200
        assert response.json()["incorporation_purpose"] == "New Company"
    
    def test_mgt6_form_crud(self):
        """Test MGT6 form CRUD operations"""
        mgt6_data = {
            "company_id": 1,
            "cin": "U12345MH2024PTC123456",
            "company_name": "Test Company Ltd",
            "company_address": "123 Test Street, Mumbai",
            "company_email": "test@company.com",
            "management_purpose": "Board Resolution",
            "resolution_date": "2024-01-01",
            "resolution_details": "Test resolution"
        }
        
        response = client.post("/mgt6/", json=mgt6_data)
        assert response.status_code == 201
        mgt6_id = response.json()["id"]
        
        response = client.get(f"/mgt6/{mgt6_id}")
        assert response.status_code == 200
        assert response.json()["management_purpose"] == "Board Resolution"
    
    def test_run_form_crud(self):
        """Test RUN form CRUD operations"""
        run_data = {
            "company_id": 1,
            "cin": "U12345MH2024PTC123456",
            "company_name": "Test Company Ltd",
            "company_address": "123 Test Street, Mumbai",
            "company_email": "test@company.com",
            "run_purpose": "Annual Return",
            "filing_date": "2024-01-01",
            "financial_year": "2023-24"
        }
        
        response = client.post("/run/", json=run_data)
        assert response.status_code == 201
        run_id = response.json()["id"]
        
        response = client.get(f"/run/{run_id}")
        assert response.status_code == 200
        assert response.json()["run_purpose"] == "Annual Return"
    
    def test_stk2_form_crud(self):
        """Test STK2 form CRUD operations"""
        stk2_data = {
            "company_id": 1,
            "cin": "U12345MH2024PTC123456",
            "company_name": "Test Company Ltd",
            "company_address": "123 Test Street, Mumbai",
            "company_email": "test@company.com",
            "stock_purpose": "Stock Transfer",
            "transfer_date": "2024-01-01",
            "transfer_amount": "50000"
        }
        
        response = client.post("/stk2/", json=stk2_data)
        assert response.status_code == 201
        stk2_id = response.json()["id"]
        
        response = client.get(f"/stk2/{stk2_id}")
        assert response.status_code == 200
        assert response.json()["stock_purpose"] == "Stock Transfer"
    
    def test_form3_crud(self):
        """Test Form3 CRUD operations"""
        form3_data = {
            "company_id": 1,
            "cin": "U12345MH2024PTC123456",
            "company_name": "Test Company Ltd",
            "company_address": "123 Test Street, Mumbai",
            "company_email": "test@company.com",
            "form_purpose": "Annual Return",
            "filing_date": "2024-01-01",
            "financial_year": "2023-24"
        }
        
        response = client.post("/form3/", json=form3_data)
        assert response.status_code == 201
        form3_id = response.json()["id"]
        
        response = client.get(f"/form3/{form3_id}")
        assert response.status_code == 200
        assert response.json()["form_purpose"] == "Annual Return"
    
    def test_mr1_form_crud(self):
        """Test MR1 form CRUD operations"""
        mr1_data = {
            "company_id": 1,
            "cin": "U12345MH2024PTC123456",
            "company_name": "Test Company Ltd",
            "company_address": "123 Test Street, Mumbai",
            "company_email": "test@company.com",
            "meeting_purpose": "Board Meeting",
            "meeting_date": "2024-01-01",
            "meeting_details": "Test meeting"
        }
        
        response = client.post("/mr1/", json=mr1_data)
        assert response.status_code == 201
        mr1_id = response.json()["id"]
        
        response = client.get(f"/mr1/{mr1_id}")
        assert response.status_code == 200
        assert response.json()["meeting_purpose"] == "Board Meeting"
    
    def test_boardreport_form_crud(self):
        """Test BOARDREPORT form CRUD operations"""
        boardreport_data = {
            "company_id": 1,
            "cin": "U12345MH2024PTC123456",
            "company_name": "Test Company Ltd",
            "company_address": "123 Test Street, Mumbai",
            "company_email": "test@company.com",
            "report_purpose": "Annual Report",
            "report_date": "2024-01-01",
            "report_details": "Test report"
        }
        
        response = client.post("/boardreport/", json=boardreport_data)
        assert response.status_code == 201
        boardreport_id = response.json()["id"]
        
        response = client.get(f"/boardreport/{boardreport_id}")
        assert response.status_code == 200
        assert response.json()["report_purpose"] == "Annual Report"
    
    def test_form_validation(self):
        """Test form validation for all forms"""
        # Test required field validation
        invalid_data = {
            "company_id": 1,
            # Missing required fields
        }
        
        # Test CHARGE form validation
        response = client.post("/charge/", json=invalid_data)
        assert response.status_code == 422  # Validation error
        
        # Test ADT1 form validation
        response = client.post("/adt1/", json=invalid_data)
        assert response.status_code == 422  # Validation error
        
        # Test DPT4 form validation
        response = client.post("/dpt4/", json=invalid_data)
        assert response.status_code == 422  # Validation error
    
    def test_form_search_functionality(self):
        """Test search functionality for all forms"""
        # Create test data
        test_forms = [
            {"form_type": "charge", "data": {"name_of_charge_holder": "Test Bank"}},
            {"form_type": "adt1", "data": {"auditor_name": "Test Auditor"}},
            {"form_type": "dpt4", "data": {"deposit_type": "Fixed Deposit"}},
        ]
        
        for form in test_forms:
            response = client.post(f"/{form['form_type']}/", json=form['data'])
            assert response.status_code == 201
        
        # Test search
        response = client.get("/charge/search/?q=Test Bank")
        assert response.status_code == 200
        assert len(response.json()) >= 1
        
        response = client.get("/adt1/search/?q=Test Auditor")
        assert response.status_code == 200
        assert len(response.json()) >= 1
    
    def test_form_status_management(self):
        """Test status management for all forms"""
        # Create test form
        form_data = {
            "company_id": 1,
            "cin": "U12345MH2024PTC123456",
            "company_name": "Test Company Ltd",
            "company_address": "123 Test Street, Mumbai",
            "company_email": "test@company.com",
            "purpose": "Test Purpose"
        }
        
        response = client.post("/charge/", json=form_data)
        assert response.status_code == 201
        form_id = response.json()["id"]
        
        # Test status change
        response = client.patch(f"/charge/{form_id}/status/false")
        assert response.status_code == 200
        assert response.json()["is_active"] == False
        
        # Test reactivation
        response = client.patch(f"/charge/{form_id}/status/true")
        assert response.status_code == 200
        assert response.json()["is_active"] == True
    
    def test_form_company_filtering(self):
        """Test company-based filtering for all forms"""
        # Create forms for different companies
        company1_data = {
            "company_id": 1,
            "cin": "U12345MH2024PTC123456",
            "company_name": "Company 1",
            "company_address": "123 Test Street, Mumbai",
            "company_email": "company1@test.com",
            "purpose": "Test Purpose 1"
        }
        
        company2_data = {
            "company_id": 2,
            "cin": "U67890MH2024PTC654321",
            "company_name": "Company 2",
            "company_address": "456 Test Street, Delhi",
            "company_email": "company2@test.com",
            "purpose": "Test Purpose 2"
        }
        
        # Create forms
        response1 = client.post("/charge/", json=company1_data)
        response2 = client.post("/charge/", json=company2_data)
        
        assert response1.status_code == 201
        assert response2.status_code == 201
        
        # Test company filtering
        response = client.get("/charge/company/1")
        assert response.status_code == 200
        assert len(response.json()) >= 1
        assert all(form["company_id"] == 1 for form in response.json())
        
        response = client.get("/charge/company/2")
        assert response.status_code == 200
        assert len(response.json()) >= 1
        assert all(form["company_id"] == 2 for form in response.json())
    
    def test_form_statistics(self):
        """Test form statistics functionality"""
        # Create test data
        test_data = {
            "company_id": 1,
            "cin": "U12345MH2024PTC123456",
            "company_name": "Test Company Ltd",
            "company_address": "123 Test Street, Mumbai",
            "company_email": "test@company.com",
            "purpose": "Test Purpose"
        }
        
        response = client.post("/charge/", json=test_data)
        assert response.status_code == 201
        
        # Test statistics
        response = client.get("/charge/statistics/")
        assert response.status_code == 200
        stats = response.json()
        assert "total_charges" in stats
        assert "active_charges" in stats
        assert stats["total_charges"] >= 1
        assert stats["active_charges"] >= 1
    
    def test_form_pagination(self):
        """Test pagination for all forms"""
        # Create multiple test forms
        for i in range(15):
            form_data = {
                "company_id": 1,
                "cin": f"U12345MH2024PTC{i:06d}",
                "company_name": f"Test Company {i}",
                "company_address": f"{i} Test Street, Mumbai",
                "company_email": f"test{i}@company.com",
                "purpose": f"Test Purpose {i}"
            }
            response = client.post("/charge/", json=form_data)
            assert response.status_code == 201
        
        # Test pagination
        response = client.get("/charge/?skip=0&limit=10")
        assert response.status_code == 200
        assert len(response.json()) == 10
        
        response = client.get("/charge/?skip=10&limit=10")
        assert response.status_code == 200
        assert len(response.json()) >= 5  # At least 5 more records
    
    def test_form_error_handling(self):
        """Test error handling for all forms"""
        # Test non-existent form
        response = client.get("/charge/99999")
        assert response.status_code == 404
        
        # Test invalid update
        response = client.put("/charge/99999", json={"purpose": "Updated"})
        assert response.status_code == 404
        
        # Test invalid delete
        response = client.delete("/charge/99999")
        assert response.status_code == 404
        
        # Test invalid status change
        response = client.patch("/charge/99999/status/true")
        assert response.status_code == 404

if __name__ == "__main__":
    pytest.main([__file__])
