export async function exportInvoicePdf(elementId: string, filename: string) {
    const element = document.getElementById(elementId)
    if (!element) return

    const html2pdf = (await import('html2pdf.js')).default

    const opt = {
        margin: 0,
        filename: `${filename}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        pagebreak: { mode: 'avoid-all' },
    }

    await html2pdf().set(opt).from(element).save()
}
