// External dependencies
import find from 'lodash/find';
import intersection from 'lodash/intersection';
import React, { PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// Internal dependencies
import styles from './styles.scss';
import KeywordsContainer from 'components/containers/keywords';
import RelatedWords from './related-words';

class SearchInput extends React.Component {
	constructor( props ) {
		super( props );

		this.handleInputKeydownBound = this.handleInputKeydown.bind( this );
		this.handleInputChangeBound = this.handleInputChange.bind( this );
		this.handleSubmitBound = this.handleSubmit.bind( this );
	}

	componentWillReceiveProps( nextProps ) {
		// sync to url the keywords if they change
		const keywordValues = this.props.keywords.map( keyword => keyword.value ),
			newKeywordValues = nextProps.keywords.map( keyword => keyword.value );

		if ( keywordValues.length !== newKeywordValues.length ||
			intersection( keywordValues, newKeywordValues ).length !== keywordValues.length ) {
			nextProps.onQueryChange( newKeywordValues.join( ' ' ) );
		}
	}

	handleInputKeydown( event ) {
		if ( event.keyCode === 8 && event.target.value.length === 0 ) { // backspace
			// Stops propagation to avoid removing two letters instead of just one
			event.preventDefault();

			this.props.removeLastKeyword();
		}
	}

	handleInputChange( event ) {
		this.props.changeInput( event.target.value );
	}

	handleSubmit( event ) {
		event.preventDefault();

		this.props.submit();
	}

	render() {
		const { selectedKeyword } = this.props,
			relatedWordsForSelectedKeyword = selectedKeyword && find( this.props.relatedWords, { word: selectedKeyword.value } );

		return (
			<form className={ styles.searchWrapper } onSubmit={ this.handleSubmitBound }>
				<KeywordsContainer />
				<ReactCSSTransitionGroup
					transitionName={ styles.relatedWords }
					transitionEnterTimeout={ 200 }
					transitionLeaveTimeout={ 200 }>
					{ selectedKeyword && relatedWordsForSelectedKeyword && (
						<RelatedWords
							relatedWords={ relatedWordsForSelectedKeyword }
							target={ selectedKeyword }
							replace={ this.props.replace } />
					) }
				</ReactCSSTransitionGroup>
				<input
					autoFocus
					ref="searchInput"
					type="text"
					className="search"
					value={ this.props.inputValue }
					placeholder={ this.props.placeholder }
					onChange={ this.handleInputChangeBound }
					onKeyDown={ this.handleInputKeydownBound }
				/>
			</form>
		);
	}
}

SearchInput.propTypes = {
	keywords: PropTypes.arrayOf( PropTypes.shape( {
		value: PropTypes.string.isRequired,
		isSelected: PropTypes.bool.isRequired
	} ) ).isRequired,
	selectedKeyword: PropTypes.shape( {
		value: PropTypes.string.isRequired,
		isSelected: PropTypes.bool.isRequired
	} ),
	relatedWords: PropTypes.array.isRequired,
	removeLastKeyword: PropTypes.func.isRequired,
	submit: PropTypes.func.isRequired,
	changeInput: PropTypes.func.isRequired
};

export default withStyles( styles )( SearchInput );