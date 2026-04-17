module.exports = cds.service.impl(async function() {
    const { Character } = this.entities;

    this.on('getTopCharacters', async (req) => {
        const { type } = req.data;
        return await SELECT.from(Character)
            .where({ type })
            .orderBy('atk desc')
            .limit(10);
    });
});