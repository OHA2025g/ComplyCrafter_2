-- Create board_meetings table
CREATE TABLE IF NOT EXISTS board_meetings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    meeting_no VARCHAR(100) NOT NULL UNIQUE,
    meeting_date DATE NOT NULL,
    venue VARCHAR(500),
    attendees INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Scheduled',
    agenda_items TEXT,
    minutes TEXT,
    created_by INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create agm_meetings table (Annual General Meetings)
CREATE TABLE IF NOT EXISTS agm_meetings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    financial_year VARCHAR(20) NOT NULL,
    meeting_date DATE NOT NULL,
    venue VARCHAR(500),
    shareholders INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Scheduled',
    notice_sent_date DATE,
    annual_report_url VARCHAR(500),
    created_by INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create egm_meetings table (Extra Ordinary General Meetings)
CREATE TABLE IF NOT EXISTS egm_meetings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    meeting_no VARCHAR(100) NOT NULL UNIQUE,
    meeting_date DATE NOT NULL,
    purpose TEXT NOT NULL,
    venue VARCHAR(500),
    status VARCHAR(50) DEFAULT 'Scheduled',
    notice_sent_date DATE,
    special_resolutions TEXT,
    created_by INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create committee_meetings table
CREATE TABLE IF NOT EXISTS committee_meetings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    meeting_no VARCHAR(100) NOT NULL UNIQUE,
    committee_type VARCHAR(200) NOT NULL,
    meeting_date DATE NOT NULL,
    venue VARCHAR(500),
    members INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Scheduled',
    agenda_items TEXT,
    minutes TEXT,
    created_by INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for board_meetings
CREATE INDEX IF NOT EXISTS idx_board_meetings_company_id ON board_meetings(company_id);
CREATE INDEX IF NOT EXISTS idx_board_meetings_meeting_date ON board_meetings(meeting_date);
CREATE INDEX IF NOT EXISTS idx_board_meetings_status ON board_meetings(status);

-- Indexes for agm_meetings
CREATE INDEX IF NOT EXISTS idx_agm_meetings_company_id ON agm_meetings(company_id);
CREATE INDEX IF NOT EXISTS idx_agm_meetings_financial_year ON agm_meetings(financial_year);
CREATE INDEX IF NOT EXISTS idx_agm_meetings_status ON agm_meetings(status);

-- Indexes for egm_meetings
CREATE INDEX IF NOT EXISTS idx_egm_meetings_company_id ON egm_meetings(company_id);
CREATE INDEX IF NOT EXISTS idx_egm_meetings_meeting_date ON egm_meetings(meeting_date);
CREATE INDEX IF NOT EXISTS idx_egm_meetings_status ON egm_meetings(status);

-- Indexes for committee_meetings
CREATE INDEX IF NOT EXISTS idx_committee_meetings_company_id ON committee_meetings(company_id);
CREATE INDEX IF NOT EXISTS idx_committee_meetings_committee_type ON committee_meetings(committee_type);
CREATE INDEX IF NOT EXISTS idx_committee_meetings_status ON committee_meetings(status);

COMMENT ON TABLE board_meetings IS 'Stores board meeting information';
COMMENT ON TABLE agm_meetings IS 'Stores annual general meeting information';
COMMENT ON TABLE egm_meetings IS 'Stores extra ordinary general meeting information';
COMMENT ON TABLE committee_meetings IS 'Stores committee meeting information (Audit, Nomination, etc.)';

