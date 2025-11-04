-- Create agendas table for meeting agenda management
CREATE TABLE IF NOT EXISTS agendas (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    agenda_title VARCHAR(500) NOT NULL,
    description TEXT,
    meeting_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Active',
    created_date DATE DEFAULT CURRENT_DATE,
    created_by INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agendas_company_id ON agendas(company_id);
CREATE INDEX IF NOT EXISTS idx_agendas_meeting_type ON agendas(meeting_type);
CREATE INDEX IF NOT EXISTS idx_agendas_status ON agendas(status);

COMMENT ON TABLE agendas IS 'Stores meeting agenda items';
COMMENT ON COLUMN agendas.agenda_title IS 'Title of the agenda item';
COMMENT ON COLUMN agendas.meeting_type IS 'Type of meeting (Board, AGM, EGM, Committee)';

