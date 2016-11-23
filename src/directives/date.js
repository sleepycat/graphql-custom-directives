import { GraphQLString, GraphQLBoolean } from 'graphql';
import { DirectiveLocation } from 'graphql/type/directives';
import { GraphQLCustomDirective } from '../custom';

const moment = require('moment');

const DEFAULT_DATE_FORMAT = 'DD MMM YYYY HH:mm';

exports.GraphQLDateDirective = new GraphQLCustomDirective({
    name: 'date',
    description:
        'Format the date from resolving the field by moment module',
    locations: [
        DirectiveLocation.FIELD
    ],
    args: {
        as: {
            type: GraphQLString,
            description: 'A format given by moment module'
        },
        isUnixTime: {
            type: GraphQLBoolean,
            description: 'If input is a 13 digit unix time'
        }
    },
    resolve(resolve, source, { as, isUnixTime }) {
        return resolve().then(input => {

            const format = as || DEFAULT_DATE_FORMAT;

            if(isUnixTime == true) {
                return moment.utc(new Date(input).toString()).format(format);
            }

            if (format.indexOf('days') !== -1 || format.indexOf('ago') !== -1) {
                return `${moment.utc().diff(input, 'days')} ${format}`;
            }

            if (!Date.parse(input)) {
                return input;
            }

            return moment.utc(input).format(format);
        });
    }
});

