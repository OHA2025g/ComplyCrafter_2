# Quick Start - Backend API Guide

## 🚀 Quick Test

```bash
# Test all 9 API endpoints
curl http://localhost:8100/agendas/
curl http://localhost:8100/shareholder-management/
curl http://localhost:8100/capital/authorized
curl http://localhost:8100/capital/paid-up
curl http://localhost:8100/capital/share
curl http://localhost:8100/meetings/board/
curl http://localhost:8100/meetings/agm/
curl http://localhost:8100/meetings/egm/
curl http://localhost:8100/meetings/committee/
```

## 📖 API Documentation

- **Swagger UI**: http://localhost:8100/docs
- **ReDoc**: http://localhost:8100/redoc

## 🔄 Frontend Integration Example

### 1. Import the service

```typescript
import { AgendasService } from '../services/agendas.service';
```

### 2. Inject in constructor

```typescript
constructor(private agendasService: AgendasService) {}
```

### 3. Call API

```typescript
ngOnInit() {
  this.agendasService.getAll().subscribe({
    next: (data) => {
      console.log('Agendas:', data);
      this.agendas = data;
    },
    error: (error) => {
      console.error('Error:', error);
    }
  });
}
```

## 📊 Available Services

| Service | File | Methods |
|---------|------|---------|
| Agendas | `agendas.service.ts` | getAll, getById, create, update, delete |
| Shareholder Management | `shareholder-management.service.ts` | getAll, create, delete |
| Capital | `capital.service.ts` | getAuthorizedCapital, getPaidUpCapital, getShareCapital |
| Meetings | `meetings.service.ts` | getBoardMeetings, getAGMMeetings, getEGMMeetings, getCommitteeMeetings |

## 🗄️ Database Tables

| Table | Purpose | Sample Records |
|-------|---------|----------------|
| `agendas` | Meeting agenda items | 3 |
| `shareholder_transactions` | Transaction tracking | 3 |
| `authorized_capital` | Authorized capital | 2 |
| `paid_up_capital` | Paid-up capital | 2 |
| `share_capital` | Share capital overview | 2 |
| `board_meetings` | Board meetings | 3 |
| `agm_meetings` | AGM meetings | 2 |
| `egm_meetings` | EGM meetings | 2 |
| `committee_meetings` | Committee meetings | 3 |

## 🔧 Re-run Setup (if needed)

```bash
cd /Users/aghoresgwarprasadsingh/Desktop/OHA\ Systems/Comply\ Crafter/Comply-Crafter-code
./scripts/setup_masters_meetings.sh
```

## 🎯 Frontend Components to Update

Update these components to use real APIs:

1. ✅ `agendas.component.ts` - Already integrated
2. `shareholder-management.component.ts` - Ready to integrate
3. `authorized-capital.component.ts` - Ready to integrate
4. `paid-up-capital.component.ts` - Ready to integrate
5. `share-capital.component.ts` - Ready to integrate
6. `board-meeting.component.ts` - Ready to integrate
7. `agm.component.ts` - Ready to integrate
8. `egm.component.ts` - Ready to integrate
9. `committee-meeting.component.ts` - Ready to integrate

## 📝 Example: Create New Record

```typescript
// In your component
addNewAgenda() {
  const newAgenda = {
    agenda_title: 'New Agenda',
    description: 'Description here',
    meeting_type: 'Board Meeting',
    status: 'Active',
    company_id: 1
  };

  this.agendasService.create(newAgenda).subscribe({
    next: (response) => {
      console.log('Created:', response);
      this.loadAgendas(); // Refresh list
    },
    error: (error) => {
      console.error('Error:', error);
    }
  });
}
```

## 🗑️ Example: Delete Record

```typescript
deleteAgenda(agenda: Agenda) {
  if (confirm(`Delete "${agenda.agendaTitle}"?`)) {
    this.agendasService.delete(agenda.id).subscribe({
      next: () => {
        console.log('Deleted successfully');
        this.loadAgendas(); // Refresh list
      },
      error: (error) => {
        console.error('Error:', error);
        alert('Error deleting. Please try again.');
      }
    });
  }
}
```

## ✅ Status: READY TO USE

All backend infrastructure is complete and tested. You can now:

1. ✅ Make API calls from frontend
2. ✅ Perform CRUD operations
3. ✅ Test with sample data
4. ✅ Build production features

---

**Full Documentation**: See `docs/BACKEND_API_COMPLETE.md`

