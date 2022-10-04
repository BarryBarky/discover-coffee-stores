import {findRecordByFilter, getMinifiedRecords, table} from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
    if (req.method === "POST") {
        // find a record
        const {id, name, neighborhood, address, imgUrl, voting} = req.body;

        try {
            if (id) {
                const records = await findRecordByFilter(id);
                if (records.length !== 0) {
                    res.json(records)
                } else {
                    if (name) {
                        // create a record
                        const createRecord =
                            await table.create([
                                {
                                    fields: {
                                        id,
                                        name,
                                        address,
                                        neighborhood,
                                        voting,
                                        imgUrl
                                    }
                                }
                            ])
                        const records = getMinifiedRecords(createRecord);
                        res.json({message: "Created a record", records})
                    } else {
                        res.status(400)
                        res.json({message: 'Id or name is missing'})
                    }
                }
            } else {
                res.status(400)
                res.json({message: 'Id is missing'})
            }
        } catch (err) {
            res.status(500);
            res.json({message: "Error Creating or Finding store", err})
        }
    }

}

export default createCoffeeStore;