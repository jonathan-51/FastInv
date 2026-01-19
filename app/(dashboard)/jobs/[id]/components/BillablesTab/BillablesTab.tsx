'use client'

import { useEffect } from 'react';
import './BillablesTab.css';
import { useBillables, BillablesProvider } from './useBillables';
import NewItemPopOut from './components/NewItem';
import { getBillableItems } from './components/actions';

const BillablesTabContent = () => {
    const { isNewItemOpen, 
            setIsNewItemOpen,
            jobID,
            orgID,
            billablesItems,
            setBillablesItems,
            addedBillableItem,
            setAddedBillableItem,
            selectedItems,
            setSelectedItems } = useBillables()


    const uniqueTypes = [...new Set(billablesItems.map(item => item.type))]
    
    const handleSelectAll = (type: string, categoryItems: any[], categoryItemsID: string[]) => {
        categoryItems.every(item => selectedItems[type]?.includes(item.id)) ?
        setSelectedItems({...selectedItems,[type]:[]})
        :
        setSelectedItems({...selectedItems,[type]:categoryItemsID})
    }

    const calculateTypeTotal = (type:{type:string}) => {
        const categoryItems = billablesItems.filter(item => item.type === type)
        return categoryItems.reduce((sum,item) => sum + (parseFloat(item.quantity)*parseFloat(item.unit_price)),0)
    }

    const getCategoryItemCount = (type: string) => {
        const categoryItems = billablesItems.filter(item => item.type === type)
        return categoryItems.length
    }

    const calculateTotal = () => {
        return billablesItems.reduce((sum,item) => sum + (parseFloat(item.quantity)*parseFloat(item.unit_price)),0).toFixed(2)
    }
    
    const calculateLabourHours = () => {
        const labourItems = billablesItems.filter(item => item.type === "Labour")
        return labourItems.reduce((sum,item) => sum + (parseFloat(item.quantity)),0)
    }

    return (
        <div className="billables-main">
            <NewItemPopOut/>
            <div className="billables-header">
                <div>Billable items</div>
                <button className='billables-remove-btn'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                </button>
                <button className='billables-add-btn' onClick={() => setIsNewItemOpen(true)}>+ Add Item</button>
            </div>
            <div className="billables-content">
                <div className="billables-body">
                    <div className="billables-body-category">
                        {uniqueTypes.map(type => {
                            const categoryItems = billablesItems.filter(item => item.type === type)
                            const categoryPrice = categoryItems.reduce((sum,item) => sum + (parseFloat(item.quantity)*parseFloat(item.unit_price)),0)
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
                                    <span >${categoryPrice.toFixed(2)}</span>
                                </div>
                                    
                                    <div className="billables-body-table">
                                    {categoryItems.map(item => (
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
                                            <span>@ {item.quantity} {item.unit}</span>
                                            <span>${(parseFloat(item.quantity)*parseFloat(item.unit_price)).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    </div>
                                
                            </div>
                            )})}

                       
                    </div>

                </div>
                <div className="billables-summary">
                    <div style={{marginBottom:'20px'}}>Summary</div>
                    <div style={{display:'flex',flexDirection:'column',gap:'4px'}}>
                    {uniqueTypes.map(type => {
                            const total_type_price = calculateTypeTotal(type)
                            const numberCategoryItems = getCategoryItemCount(type)
                        return (
                        <div key={type} className='billables-summary-type'>
                            <span>{type} ({numberCategoryItems} items)</span>
                            <span style={{textAlign:'right'}}>${total_type_price.toFixed(2)}</span>
                        </div>
                    )})}
                    </div>
                    <div className='billables-summary-total'>
                        <span>Total</span>
                        <span style={{textAlign:'right'}}>${calculateTotal()}</span>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button className='billables-summary-invoice-btn'>Generate Invoice</button>
                        <button className='billables-summary-pdf-btn'>Export PDF</button>
                    </div>

                    <div style={{marginTop:'15px',backgroundColor:'var(--surface-3',borderRadius:'8px'}}>
                        <span>Hourly Breakdown</span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <span>{calculateLabourHours()}</span>
                            <span>Total Hours Logged</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const BillablesTab = (
    { jobID, orgID, initialBillablesItems, initialSetBillablesItems }: 
    { jobID: string; orgID: string; initialBillablesItems?: any[]; initialSetBillablesItems?: any }) => {
    return (
        <BillablesProvider 
        jobID={jobID} 
        orgID={orgID}
        initialBillablesItems={initialBillablesItems}
        initialSetBillablesItems={initialSetBillablesItems} >
            <BillablesTabContent />
        </BillablesProvider>
    );
};
