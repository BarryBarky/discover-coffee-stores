import {findRecordByFilter, getMinifiedRecords, table} from "../../lib/airtable";

const favouriteCoffeeStoreById = async (req, res) => {
    if (req.method === "PUT") {
        try {
            const {id} = req.body;
            if (id) {
                const records = await findRecordByFilter(id);
                if (records.length !== 0) {
                    const record = records[0];
                    const calculateVoting = parseInt(record.voting) + parseInt(1);

                    // update a record
                    const updateRecord = await table.update([{
                       id: record.recordId,
                       fields: {
                           voting: calculateVoting
                       }
                    }
                    ])
                    if (updateRecord) {
                        const minifiedRecords = getMinifiedRecords(updateRecord)
                        res.json(minifiedRecords)
                    }
                } else {
                    res.json({message: "Coffee store id doesn't exist", id})
                }
            } else {
                res.status(400)
                res.json({message: 'Id is missing'})
            }
        } catch (e) {
            console.error(e)
            res.status(500)
            res.json({message: 'Error upvoting our coffee store', e})
        }

    } else {
        res.json({message: 'this doesnt work'})
    }

}

export default favouriteCoffeeStoreById;