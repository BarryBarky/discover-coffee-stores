const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_KEY);

const table = base('coffee-stores');

const getMinifiedrecord = (record) => {
    return {
        recordId: record.id,
        ...record.fields,
    }
}

const getMinifiedRecords = (records) => {
 return records.map((record) => getMinifiedrecord(record));
}

const findRecordByFilter = async (id) => {

    const findCoffeeStoresRecords = await table.select({
        filterByFormula: `id="${id}"`
    }).firstPage();

    return getMinifiedRecords(findCoffeeStoresRecords);
}

export {table, getMinifiedRecords, findRecordByFilter};