module.exports = function (Club) {

    /**
     * Query clubs for bookable resources and return prepared Club instances
     *
     * @param {String} query param (looking up locations and club names)
     * @param {Number} [amount=1]
     * @param {Date} [date]
     * @param {Array} [offers]
     * @param {Function} cb
     */
    Club.search = function (query, amount, date, offers, cb) {
        query = (function (query) {
            query = query.replace(/ /g, '(.*)');
            query = '.*' + query + '.*';

            return new RegExp(query, "i");
        })(query);

        amount = amount || 1;
        date = date || new Date();
        offers = offers || [];

        var whereFilter = {
            //or: {name: {like: query}}
            name: {like: query}
        };


        Club.find({
            where: whereFilter,
            include: ['address', {relation: 'media', scope: {limit: 1, orderBy: 'order DESC'}}]
        }, cb);
    };

    Club.remoteMethod(
        'search',
        {
            accepts: [
                {arg: 'query', type: 'string', required: true},
                {arg: 'amount', type: 'number'},
                {arg: 'date', type: 'date'},
                {arg: 'offers', type: 'array'}
            ],
            returns: {arg: 'clubs', type: 'array', root: true},
            http: {
                verb: "GET"
            },
            description: "Query clubs for bookable resources"
        }
    );

};
