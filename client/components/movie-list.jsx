import React from 'react'
import { List, Loader, Item } from 'semantic-ui-react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Movie from './movie'
import { Movies, UserMovies } from '../../shared/collections'

export const MovieList = ({
	movies,
	selectMovie,
	itemWrapper: ItemWrap = Item,
	wrapper: Wrap = List,
	className,
	loading = false,
	showRemove = false,
	helpText,
}) => (
	<Wrap {...{ className }}>
		{loading && (
			<ItemWrap>
				<Loader />
			</ItemWrap>
		)}
		{!loading &&
			(movies.length ? (
				movies.map(movie => (
					<Movie
						movie={movie}
						selectMovie={selectMovie}
						key={movie._id}
						wrapper={ItemWrap}
						showRemove={showRemove}
					/>
				))
			) : (
				<ItemWrap>
					<p className='muted'>{helpText}</p>
				</ItemWrap>
			))}
	</Wrap>
)

const ListContainer = withTracker(() => {
	const userMoviesCursor = Meteor.subscribe('usermovies')
	const userMovies = UserMovies.find({
		owner: Meteor.userId(),
	}).fetch()
	const userMovieIds = userMovies.map(({ movie }) => movie)

	return {
		movies: Movies.find({
			_id: { $in: userMovieIds },
		}).fetch(),
		loading: !userMoviesCursor.ready(),
		helpText: `Add the movies you think everyone should see before they die.
		Because it's amazing. Because it makes you think. Because it makes you cry.
		Because who cares about the reviews, I like it and dammit you're watching
		it.`,
	}
})(MovieList)

export default ListContainer
