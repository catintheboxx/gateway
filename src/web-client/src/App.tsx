import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, split, DefaultOptions } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { Tags } from './components/Tags';
import { AddTag } from './components/AddTag';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from "@apollo/client/link/ws";

const httpLink = new HttpLink({
  uri: 'http://localhost:5126/graphql'
});

const link = new WebSocketLink(
  new SubscriptionClient("ws://localhost:5126/graphql", {
    reconnect: true
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  link,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <AddTag />
          <Tags />
        </header>
      </div>
    </ApolloProvider>
  );
}

export default App;
