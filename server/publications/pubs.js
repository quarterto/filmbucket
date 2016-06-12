import {Meteor} from 'meteor/meteor';
import {UserMovies, Movies} from '../../shared/collections';
import omdb from '../omdb';

const getMovie = i => omdb({i});

function moviePublish(_id) {
	const cached = Movies.find({_id});
	if (cached.count()) {
		return cached;
	}

	const movie = getMovie(_id);
	movie._id = _id;
	this.added('movies', _id, movie);
	Movies.insert(movie);
	this.ready();
}

Meteor.publish('movie', moviePublish);

Meteor.publishComposite('usermovies', {
	find() {
		return UserMovies.find({owner: this.userId});
	},

	children: [{
		find(userMovie) {
			return moviePublish.call(this, userMovie.movie);
		},
	}],
});
