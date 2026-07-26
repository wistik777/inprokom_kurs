import { formatPrice, getProductCategoriesLabel } from './formatPrice';

function buildExportRows(products) {
    return products.map((product, index) => ({
        index: index + 1,
        name: product.name ?? '',
        model: product.model ?? '',
        price: formatPrice(product.price),
        categories: getProductCategoriesLabel(product),
        description: product.description ?? '',
    }));
}

function buildExportFileName(extension) {
    const date = new Date().toISOString().slice(0, 10);
    return `katalog-inprokom-${date}.${extension}`;
}

export async function exportProductsToExcel(products) {
    const XLSX = await import('xlsx');
    const rows = buildExportRows(products);

    const worksheet = XLSX.utils.json_to_sheet(
        rows.map((row) => ({
            '№': row.index,
            'Наименование': row.name,
            'Модель': row.model,
            'Цена': row.price,
            'Категории': row.categories,
            'Описание': row.description,
        }))
    );

    worksheet['!cols'] = [
        { wch: 5 },
        { wch: 34 },
        { wch: 16 },
        { wch: 14 },
        { wch: 28 },
        { wch: 48 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Каталог');
    XLSX.writeFile(workbook, buildExportFileName('xlsx'));
}

function buildPdfTableBody(rows) {
    const header = [
        { text: '№', style: 'tableHeader' },
        { text: 'Наименование', style: 'tableHeader' },
        { text: 'Модель', style: 'tableHeader' },
        { text: 'Цена', style: 'tableHeader' },
        { text: 'Категории', style: 'tableHeader' },
        { text: 'Описание', style: 'tableHeader' },
    ];

    const body = rows.map((row) => [
        { text: String(row.index), style: 'tableCellCenter' },
        { text: row.name, style: 'tableCell' },
        { text: row.model, style: 'tableCell' },
        { text: row.price, style: 'tableCellPrice' },
        { text: row.categories, style: 'tableCell' },
        { text: row.description || '—', style: 'tableCellMuted' },
    ]);

    return [header, ...body];
}

export async function exportProductsToPdf(products) {
    const pdfMakeModule = await import('pdfmake/build/pdfmake');
    const pdfFontsModule = await import('pdfmake/build/vfs_fonts');

    const pdfMake = pdfMakeModule.default ?? pdfMakeModule;
    const pdfFonts = pdfFontsModule.default ?? pdfFontsModule;

    pdfMake.vfs = pdfFonts.pdfMake?.vfs ?? pdfFonts.vfs ?? pdfFonts;

    const rows = buildExportRows(products);

    const docDefinition = {
        pageOrientation: 'landscape',
        pageMargins: [28, 40, 28, 32],
        defaultStyle: {
            font: 'Roboto',
            fontSize: 9,
            color: '#181818',
        },
        content: [
            {
                text: 'Каталог продукции НПП Инпроком',
                style: 'title',
                margin: [0, 0, 0, 6],
            },
            {
                text: `Всего позиций: ${products.length}`,
                style: 'subtitle',
                margin: [0, 0, 0, 14],
            },
            {
                table: {
                    headerRows: 1,
                    widths: [22, '*', 58, 52, 95, '*'],
                    body: buildPdfTableBody(rows),
                },
                layout: {
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                    hLineColor: () => '#e0e0e0',
                    vLineColor: () => '#e0e0e0',
                    paddingLeft: () => 6,
                    paddingRight: () => 6,
                    paddingTop: () => 5,
                    paddingBottom: () => 5,
                    fillColor: (rowIndex) => (rowIndex === 0 ? '#FA4234' : null),
                },
            },
        ],
        styles: {
            title: {
                fontSize: 16,
                bold: true,
                color: '#FA4234',
            },
            subtitle: {
                fontSize: 10,
                color: '#666666',
            },
            tableHeader: {
                bold: true,
                fontSize: 8,
                color: '#ffffff',
            },
            tableCell: {
                fontSize: 8,
            },
            tableCellCenter: {
                fontSize: 8,
                alignment: 'center',
            },
            tableCellPrice: {
                fontSize: 8,
                bold: true,
                color: '#FA4234',
            },
            tableCellMuted: {
                fontSize: 8,
                color: '#666666',
            },
        },
    };

    pdfMake.createPdf(docDefinition).download(buildExportFileName('pdf'));
}
