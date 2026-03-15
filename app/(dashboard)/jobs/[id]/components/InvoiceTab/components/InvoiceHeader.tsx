'use client'

export const InvoiceHeader = () => {


    return (
        <div className="invoice-header">
            <span className="invoice-header-title">Invoice</span>
            <span className="invoice-header-number">INV-2024-0047</span>
            <div className="invoice-header-status sent">SENT</div>
        </div>
    )
}