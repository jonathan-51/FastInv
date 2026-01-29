'use client'

import { ChangeEvent } from 'react'

interface Props {
    issuedDate: string
    dueDate: string
    selectedTemplate: string
    onIssuedDateChange: (e: ChangeEvent<HTMLInputElement>) => void
    onDueDateChange: (e: ChangeEvent<HTMLInputElement>) => void
    onTemplateChange: (template: string) => void
}

export const InvoiceRightSideBar = ({
    issuedDate,
    dueDate,
    selectedTemplate,
    onIssuedDateChange,
    onDueDateChange,
    onTemplateChange
}: Props) => {

    return (
        <div className='invoice-content-right-side'>
            <span className="invoice-action-section-title">Actions</span>
            <button className="invoice-action-btn invoice-action-btn-primary">Send Email</button>
            <button className="invoice-action-btn invoice-action-btn-secondary">Preview Invoice</button>
            <button className="invoice-action-btn invoice-action-btn-secondary">Download PDF</button>
            <div className="invoice-action-divider"></div>
            <div className="invoice-date-input-wrapper">
                <span>Issue Date</span>
                <input
                    type="date"
                    defaultValue={issuedDate}
                    className="invoice-date-input"
                    onChange={(e) => onIssuedDateChange(e)}
                />
            </div>

            <div className="invoice-date-input-wrapper">
                <span>Payment Terms</span>
                <input
                    type="date"
                    defaultValue={dueDate}
                    className="invoice-date-input"
                    onChange={(e) => onDueDateChange(e)}
                />
            </div>
            <div className="invoice-date-input-wrapper">
                <span>Templates</span>
                <select
                    value={selectedTemplate}
                    onChange={(e) => onTemplateChange(e.target.value)}
                    className="invoice-date-input"
                >
                    <option value="standard">Standard</option>
                    <option value="itemized">Itemized</option>
                </select>
            </div>
        </div>
    )
}