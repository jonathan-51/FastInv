'use client'

import './BillablesTab.css';
import { useBillables } from './useBillables';
import NewItemPopOut from './components/NewItem';
import { useJobData } from '../../context/JobDataContext';
import { createInvoice, deleteBillable } from '@/lib/storage';
import { useBillablesCategory } from '@/app/context/BillablesContext';


export const BillablesTab = () => {
    // Context: job data and markup settings
    const { jobData, updateInvoice, removeBillable } = useJobData()
    const { getTypeMarkup } = useBillablesCategory()
    const billablesItems = jobData.billables

    // UI state: new item modal and row selection
    const { isNewItemOpen, setIsNewItemOpen, selectedItems, setSelectedItems } = useBillables()

    // Get unique billable categories (e.g. Labour, Materials)
    const uniqueTypes = [...new Set(billablesItems.map(item => item.type))]

    // Toggle select all items within a category
    const handleSelectAll = (type: string, categoryItems: any[], categoryItemsID: string[]) => {
        categoryItems.every(item => selectedItems[type]?.includes(item.id)) ?
        setSelectedItems({...selectedItems,[type]:[]})
        :
        setSelectedItems({...selectedItems,[type]:categoryItemsID})
    }

    // Calculate total for a single category (with markup applied)
    const calculateTypeTotal = (type:string) => {
        const categoryItems = billablesItems.filter(item => item.type === type)
        const markup = getTypeMarkup(type)
        return (categoryItems.reduce((sum,item) => sum + (item.quantity*item.unit_price),0) * markup).toFixed(2)
    }

    const getCategoryItemCount = (type: string) => {
        return billablesItems.filter(item => item.type === type).length
    }

    // Calculate grand total across all categories (with per-type markup)
    const calculateTotal = () => {
        return billablesItems.reduce((sum, item) => {
            const markup = getTypeMarkup(item.type)
            return sum + (item.quantity * item.unit_price * markup)
        }, 0).toFixed(2)
    }

    // Sum up total hours from Labour items
    const calculateLabourHours = () => {
        const labourItems = billablesItems.filter(item => item.type === "Labour")
        return labourItems.reduce((sum,item) => sum + (item.quantity),0)
    }

    // Remove all selected billables from localStorage and context
    const handleRemoveSelected = () => {
        const allSelectedIds = Object.values(selectedItems).flat()
        allSelectedIds.forEach(id => {
            deleteBillable(jobData.id, id)
            removeBillable(id)
        })
        setSelectedItems({})
    }

    // Create invoice in localStorage and update context
    const generateInvoice = () => {
        const invoice = createInvoice(jobData.id)
        updateInvoice(invoice)
    }

    return (
        <div className="billables-main">
            {/* Add new item modal */}
            <NewItemPopOut/>

            {/* Header with title and action buttons */}
            <div className="billables-header">
                <div>Billable items</div>
                <button className='billables-remove-btn'
                onClick={handleRemoveSelected}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                </button>
                <button className='billables-add-btn' onClick={() => setIsNewItemOpen(true)}>+ Add Item</button>
            </div>
            <div className="billables-content">
                {/* Left side: billable items grouped by category */}
                <div className="billables-body">
                    <div className="billables-body-category">
                        {uniqueTypes.map(type => {
                            const categoryItems = billablesItems.filter(item => item.type === type)
                            const categoryPrice = categoryItems.reduce((sum,item) => sum + (item.quantity*item.unit_price),0)
                            const categoryItemsID = categoryItems.map(item => item.id)
                            return (
                            <div key={type} className='billables-body-type'>
                                <div className="billables-body-headers">
                                    <div 
                                    className='billables-body-headers-select'
                                    onClick={() => handleSelectAll(type,categoryItems,categoryItemsID)
                                    }>
                                        
                                        {categoryItems.every(item => selectedItems[type]?.includes(item.id)) ? '✓' : ''}

                                    </div>
                                    <span >{type}</span>
                                    <span></span>
                                </div>
                                <div className="billables-body-subheaders">
                                    <span></span>
                                    <span>Description</span>
                                    <span>Quantity</span>
                                    <span>Unit Cost</span>
                                    <span>Unit Sell Price</span>
                                    <span>Amount</span>
                                </div>
                                    
                                <div className="billables-body-table">
                                {categoryItems.map(item => {
                                    const markup = getTypeMarkup(item.type)
                                    return (
                                    <div key={item.id} className="billables-body-row">
                                        <div className='billables-body-row-select'
                                            onClick={() => selectedItems[type]?.includes(item.id) ?
                                                setSelectedItems({...selectedItems,[type]:(selectedItems[type] as string[])?.filter(i => i !== item.id)})
                                                :
                                                setSelectedItems({...selectedItems,[type]:[...(selectedItems[type] ?? []),item.id]})
                                            }>
                                                {selectedItems[type] && selectedItems[type]?.includes(item.id) ? '✓':''}
                                            </div>
                                        <span>{item.description}</span>
                                        <span>{item.quantity} {item.unit}</span>
                                        <span>${(item.unit_price ?? 0).toFixed(2)}</span>
                                        <span>${((item.unit_price ?? 0) * markup).toFixed(2)}</span>
                                        <span>${(item.quantity * (item.unit_price ?? 0) * markup).toFixed(2)}</span>
                                    </div>
                                )})}
                                </div>
                                
                            </div>
                            )})}

                       
                    </div>

                </div>
                {/* Right side: summary panel */}
                <div className="billables-summary">
                    <div>Summary</div>

                    <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                    {uniqueTypes.map(type => {
                            const total_type_price = calculateTypeTotal(type)
                            const numberCategoryItems = getCategoryItemCount(type)
                        return (
                        <div key={type} className='billables-summary-type'>
                            <span>{type} ({numberCategoryItems} {numberCategoryItems === 1 ? 'item' : 'items'})</span>
                            <span>${total_type_price}</span>
                        </div>
                    )})}
                    </div>

                    <div className='billables-summary-total'>
                        <span>Total</span>
                        <span>${calculateTotal()}</span>
                    </div>

                    {/* Invoice and PDF actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button className='billables-summary-invoice-btn'
                        onClick={generateInvoice}
                        disabled={jobData.invoice !== null}>
                            {jobData.invoice ? 'Invoice Already Exists' : 'Generate Invoice'}
                            </button>
                        <button className='billables-summary-pdf-btn'>Export PDF</button>
                    </div>

                    <div className='billables-summary-hourly'>
                        <span>Hourly Breakdown</span>
                        <div className='billables-summary-hourly-content'>
                            <span>{calculateLabourHours()}</span>
                            <span>Total Hours Logged</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
