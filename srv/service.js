module.exports = cds.service.impl(async function() {
    const { Character } = this.entities;

    const VALID_TYPES = ["AGL", "TEQ", "INT", "STR", "PHY"];

    this.on('getTopCharacters', async (req) => {
        const { type } = req.data;

        if (!type || !VALID_TYPES.includes(type.toUpperCase())) {
            return req.error(400, `Invalid type. Must be one of: ${VALID_TYPES.join(", ")}`);
        }

        return await SELECT.from(Character)
            .where({ type: type.toUpperCase() })
            .orderBy('atk desc')
            .limit(10);
    });
});