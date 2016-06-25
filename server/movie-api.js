import {HTTP} from 'meteor/http';
import url from 'url';
import mapKeys from 'deep-map-keys';
import camelCase from 'camel-case';

const formatUrl = query => url.format({
	protocol: 'https',
	hostname: 'www.omdbapi.com',
	query,
});

export const call = query => {
	const result = HTTP.get(formatUrl(query));
	if (!result.data) {
		throw new Error(`No JSON returned for query ${JSON.stringify(query)}`);
	}
	if (result.data.Response === 'False') {
		const err = new Error(`OMDB Error for query ${JSON.stringify(query)}: ${result.data.Error}`);
		err.result = result;
		throw err;
	}
	return mapKeys(result.data, camelCase);
};

export const getById = i => call({i});
export const search = s => call({s}).search;