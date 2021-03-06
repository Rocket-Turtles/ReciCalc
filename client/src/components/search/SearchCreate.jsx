import React from 'react';
import axios from 'axios';
import SearchInput from './SearchInput.jsx';
import SearchList from './SearchList.jsx';
import SearchResultList from './SearchResultList.jsx';
import { Link } from 'react-router-dom';
import { getRecipeFromEdamam } from '../../../../server/routes/search.js';

const EDAMAM_APP_ID = process.env.API_KEY;
const EDAMAM_KEY = process.env.API_KEY;

class SearchCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: [],
      ingredient: '',
      searchResults: [{
        label: '',
        image: '',
        labels: [], //need to concat dietLables and healthLabels
        ingredientLines: [],
        calories: 0,
        totalFat: 0,
        satFat: 0,
        cholesterol: 0,
        totalCarbs: 0,
        sugar: 0,
        fiber: 0,
        protein: 0,
      }],
    };
    this.addIngredient = this.addIngredient.bind(this);
    this.handleIngredientChange = this.handleIngredientChange.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
  }

  handleIngredientChange(e) {
    this.setState({
      ingredient: e.target.value,
    })
  }

  addIngredient() {
    const ingredient = this.state.ingredient;
    this.setState(prevState => ({
      ingredients: [...prevState.ingredients, ingredient],
      ingredient: ''
    }))
  }

  deleteIngredient(e) {
    let ingredients = [...this.state.ingredients];
    let index = e.target.name;
    ingredients.splice(index, 1);
    this.setState({
      ingredients: ingredients
    });
  }

  submitSearch() {
    if (this.state.ingredients.length) {
      axios.get('/api/search', {
        params: {
          ingredients: this.state.ingredients
        }
      })
      .then(res => {
        console.log('res on client from get search is ', res);
        this.updateSearchResults(res.data);
      })

      .catch(err => {
        console.log('error on client from get search is ', err);
      })
      // getRecipeFromEdamam(this.state.ingredients)
      // .then(res => {
      //   console.log(JSON.stringify(res.data));
      // }) //todo format incoming data then setState
      // .then() //todo figure out how to link to new route link
    } else {
      alert('please select an ingredient');
    }
  }

  updateSearchResults(results) {
    console.log('from update', results);
    this.setState({
      searchResults: results,
      ingredients: []
    });
  }

  render() {
    return (
      <div >
        <input
            className='button'
            onClick={() => this.submitSearch()}
            type='submit'
            value='Search for Recipes!'
        />
        <SearchInput 
          addIngredient={this.addIngredient}
          ingredient={this.state.ingredient}
          handleIngredientChange={this.handleIngredientChange}
        />
        <SearchList 
          ingredients={this.state.ingredients}
          deleteIngredient={this.deleteIngredient}
        />
        {/* {console.log('in render', this.state.searchResults)} */}
        <div>
          <SearchResultList searchResults={this.state.searchResults}/>
        </div>
      </div>
    )
  }
}

export default SearchCreate;