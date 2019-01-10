import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import { ApolloProvider , Query } from "react-apollo";

const client = new ApolloClient({
	uri: "http://apollo-graphql.herokuapp.com:"+ (process.env.PORT || 4000) + "/graphql"
})


const ExchangeRates = () => (
  <Query
    query={gql`
      {
        allPaintings {
          id name url
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return data.allPaintings.map(({ id, name , url }) => (
        <div key={id}>
          <p>{name}: {url}</p>
        </div>
      ));
    }}
  </Query>

)

const App = () => (
	<ApolloProvider client={client}>
		<div>
			<h2>My first Apollo app <span role="img" aria-label="rocket">🚀</span></h2>
			<ExchangeRates/>
		</div>
	</ApolloProvider>
)

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
