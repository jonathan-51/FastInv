'use client'

interface Props {
    onGenerate: () => void
}

export const InvoiceEmptyState = ({onGenerate}:Props) => {

    return (
        <div className="invoice-empty-state">
            <div className="invoice-empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                </svg>
            </div>
            <h3 className="invoice-empty-title">No invoice yet</h3>
            <p className="invoice-empty-description">
                Create an invoice from the billable items you've added to this job.
            </p>
            <button className="invoice-empty-btn" onClick={onGenerate}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                </svg>
                Generate Invoice
            </button>
        </div>
    )
}