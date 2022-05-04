import { GraphQLClient } from 'graphql-request';


const DOMAIN = {
  development: 'http://localhost:3000',
  production: 'https://api.mybudget.ws'
}[process.env.NODE_ENV];

const ENDPOINT = DOMAIN + '/graphql';

export default {
  // ---------------------------------
  // User
  // ---------------------------------

  async login(email, password) {
    const query = `
      query($email:String!, $password:String!) {
        user:signIn(email: $email, password: $password) {
          email
          token
          defaultCurrency { name }
        }
      }
    `;
    const vars = { email, password };
    const data = await this.client().request(query, vars);
    this.log('login', data);

    return data;
  },

  async autoSignUp() {
    const query = `
      query {
        user:autoSignUp {
          email
          token
          defaultCurrency { name }
        }
      }
    `;
    const data = await this.client().request(query);
    this.log('autoSignUp', data);

    return data;
  },

  async fetchProfile(token) {
    const query = `
      query {
        user:fullProfile { email defaultCurrency { id name } }
      }
    `;
    const data = await this.client(token).request(query);
    this.log('fetchProfile', data);

    return data.user;
  },

  // ---------------------------------
  // S::Companies
  // ---------------------------------
  async company(token, { id }) {
    const query = `query($id:ID!) {
      item:company(id:$id) {
        id name logoUrl website ceo description lastPrice
        dividends {
          currency { name }
          amount dateAt description flag frequency
        }
      }
    }`;
    const vars = { id };
    const data = await this.client(token).request(query, vars);
    this.log(query, data);

    return data.item;
  },

  // ---------------------------------
  // S::Symbols
  // ---------------------------------
  async symbols({ kind, isPopular, page, perPage, search }) {
    const query = `query(
      $kind:String, $isPopular:Boolean, $page:Int, $perPage:Int, $search:String
    ) {
      items:symbols(
        kind:$kind, isPopular:$isPopular, page:$page, perPage:$perPage, search:$search
      ) {
        id name displayName lastPrice logoUrl
        company {
          id name logoUrl
          sector { id name }
          industry { id name }
        }
      }
    }`;
    const vars = { kind, isPopular, page, perPage, search };
    const data = await this.client().request(query, vars);
    this.log(query, data, vars);

    return data.items;
  },

  async symbol(token, { id }) {
    const query = `query($id:ID!) {
      item:symbol(id:$id) {
        id name logoUrl lastPrice
        company {
          id name logoUrl website ceo description
          sector { id name }
          industry { id name }
          dividends {
            currency { name }
            amount dateAt description flag frequency
          }
        }
      }
    }`;
    const vars = { id };
    const data = await this.client(token).request(query, vars);
    this.log(query, data);

    return data.item;
  },

  // ---------------------------------
  // S::Articles
  // ---------------------------------
  async articles(token, { id, isFavouriteOnly, page, perPage }) {
    const query = `query($id:Int, $isFavouriteOnly:Boolean, $page:Int, $perPage:Int) {
      items:articles(id:$id, isFavouriteOnly:$isFavouriteOnly, page:$page, perPage:$perPage) {
        id title dateAt url source summary isFavourite
        symbols {
          id name
          company {
            id name logoUrl
          }
        }
      }
    }`;
    const vars = { id, isFavouriteOnly, page, perPage };
    const data = await this.client(token).request(query, vars);

    return data.items;
  },

  // ---------------------------------
  // S::Dividends
  // ---------------------------------
  async dividends(token, { page, perPage }) {
    const query = `query($page:Int, $perPage:Int) {
      items:dividends(page:$page, perPage:$perPage) {
        id amount dateAt description flag frequency
        currency { name }
        symbol {
          id name logoUrl kind lastPrice
          company {
            id name logoUrl
          }
        }
      }
    }`;
    const vars = { page, perPage };
    const data = await this.client(token).request(query, vars);
    this.log(query, data);

    return data.items;
  },

  // ---------------------------------
  // S::Signals
  // ---------------------------------
  async signals(token, { symbolId, search, minRating, direction, interval, page, perPage }) {
    const query = `query(
      $symbolId:Int,
      $search:String,
      $minRating:Int,
      $direction:String,
      $interval:String,
      $page:Int,
      $perPage:Int
    ) {
      items:signals(
        symbolId:$symbolId,
        search:$search,
        minRating:$minRating,
        direction:$direction,
        interval:$interval,
        page:$page,
        perPage:$perPage
      ) {
        id dateAt kind interval direction createdAt rating
        point { close }
        takeProfit
        stopLoss
        isTakeProfit
        isStopLoss
        lastDailyPrice
        dealResultPercent
        symbol {
          id name logoUrl kind
          company {
            id name logoUrl
          }
        }
      }
    }`;
    const vars = { symbolId, search, minRating, direction, interval, page, perPage };
    const data = await this.client(token).request(query, vars);
    this.log(query, data);

    return data.items;
  },

  async signalsStats(token, _params) {
    const query = `query {
      chart:signalsStats {
        categories
        series {
          name
          data
        }
        signals {
          id
          name
          date
          rating
          dealByDayResultPercent
          dealByTpResultPercent
        }
      }
    }`;
    // const vars = { symbolId, search, minRating, direction, interval, page, perPage };
    const data = await this.client(token).request(query);
    this.log(query, data);

    return data.chart;
  },

  // ---------------------------------
  // Account
  // ---------------------------------

  async accounts(token) {
    const query = `{
      items:accounts { id name color isFavourite isHidden balance currency { name } }
    }`;
    const data = await this.client(token).request(query);
    this.log(query, data);

    return data.items;
  },

  async accountsFilter(token) {
    const query = `{
      items:accounts { id name color isFavourite isHidden currency { name } }
    }`;
    const data = await this.client(token).request(query);
    this.log(query, data);

    return data.items;
  },

  async account(token, { id }) {
    const query = `query($id:ID!) {
      item:account(id:$id) { id name color currency { name } }
    }`;
    const vars = { id };
    const data = await this.client(token).request(query, vars);
    this.log(query, data);

    return data.item;
  },

  async createAccount(token, { name, color, currency }) {
    const query = `
      mutation($name:String!, $color:String!, $currency:String!) {
        createAccount(
          name: $name,
          color: $color,
          currency: $currency
        ) { id name color balance currency { name } }
      }
    `;
    const vars = { name, color, currency };
    const data = await this.client(token).request(query, vars);
    this.log('createAccount', data);

    return data.createAccount;
  },

  async updateAccount(token, { id, name, color, currency }) {
    const query = `
      mutation($id:ID!, $name:String!, $color:String!, $currency:String!) {
        action:updateAccount(
          id: $id,
          name: $name,
          color: $color,
          currency: $currency
        ) { id name color currency { name } }
      }
    `;
    const vars = { id, name, color, currency };
    const data = await this.client(token).request(query, vars);
    this.log('updateAccount', data);

    return data.action;
  },

  async destroyAccount(token, id) {
    const query = `
      mutation($id:ID!) { action:destroyAccount(id: $id) { id } }
    `;
    const data = await this.client(token).request(query, { id });
    this.log('destroyAccount', data);

    return data.action;
  },

  // ---------------------------------
  // Transaction
  // ---------------------------------

  async transactions(token, { page, perPage, filters }) {
    const query = `
      query($page:Int, $perPage:Int, $accountIds:[Int!], $categoryIds:[Int!], $projectIds:[Int!]) {
        items:transactions(
          page: $page,
          perPage: $perPage,
          accountIds: $accountIds,
          categoryIds: $categoryIds,
          projectIds: $projectIds
        ) {
          id
          amount
          description
          dateAt
          account { id name color currency { name } }
          categories { id name color }
          project { id name color }
          isTransfer
        }
      }
    `;
    const { accountIds, categoryIds, projectIds } = filters;
    const vars = { page, perPage, accountIds, categoryIds, projectIds };
    const data = await this.client(token).request(query, vars);
    this.log('transactions', data);
    return data.items;
  },

  async transaction(token, { id }) {
    const query = `
      query($id:ID!) {
        item:transaction(id:$id) {
          id
          amount
          description
          dateAt
          account { id name color currency { name } }
          categories { id name color }
          project { id name color }
        }
      }
    `;
    const vars = { id };
    const data = await this.client(token).request(query, vars);
    this.log(query, data);

    return data.item;
  },

  async createTransaction(
    token,
    { amount, isIncome, date, description, accountId, projectId, categoryIds }
  ) {
    const query = `
      mutation(
        $amount:String!,
        $isIncome:Boolean!,
        $date:String!,
        $categoryIds:[Int!]!,
        $description:String,
        $accountId:String!,
        $projectId:String
      ) {
        action:createTransaction(
          amount: $amount,
          isIncome: $isIncome,
          date: $date,
          categoryIds: $categoryIds,
          description: $description,
          accountId: $accountId,
          projectId: $projectId,
        )
      }
    `;
    const vars = {
      amount,
      isIncome,
      date,
      categoryIds,
      description,
      accountId: accountId.toString(),
      projectId: projectId.toString()
    };
    const data = await this.client(token).request(query, vars);
    this.log('createTransaction', data);

    return data.action;
  },

  async updateTransaction(
    token,
    { id, amount, isIncome, date, description, accountId, projectId, categoryIds }
  ) {
    const query = `
      mutation(
        $id:ID!,
        $amount:String!,
        $isIncome:Boolean!,
        $date:String!,
        $categoryIds:[Int!]!,
        $description:String,
        $accountId:String!,
        $projectId:String
      ) {
        action:updateTransaction(
          id: $id,
          amount: $amount,
          isIncome: $isIncome,
          date: $date,
          categoryIds: $categoryIds,
          description: $description,
          accountId: $accountId,
          projectId: $projectId,
        ) { id }
      }
    `;
    const vars = {
      id,
      amount,
      isIncome,
      date,
      categoryIds,
      description,
      accountId: accountId.toString(),
      projectId: projectId.toString()
    };
    const data = await this.client(token).request(query, vars);
    this.log('updateTransaction', data);

    return data.action;
  },

  async destroyTransaction(token, id) {
    const query = `
      mutation($id:ID!) { action:destroyTransaction(id: $id) { id } }
    `;
    const data = await this.client(token).request(query, { id });
    this.log('destroyTransaction', data);

    return data.action;
  },

  async createTransactionTransfer(
    token,
    { amountSrc, amountDst, accountIdSrc, accountIdDst, date, description }
  ) {
    const query = `
      mutation(
        $amountSrc:String!,
        $amountDst:String!,
        $accountIdSrc:String!,
        $accountIdDst:String!,
        $date:String!,
        $description:String
      ) {
        action:createTransactionTransfer(
          amountSrc: $amountSrc,
          amountDst: $amountDst,
          accountIdSrc: $accountIdSrc,
          accountIdDst: $accountIdDst,
          date: $date,
          description: $description
        )
      }
    `;
    const vars = {
      amountSrc,
      amountDst,
      accountIdSrc: accountIdSrc.toString(),
      accountIdDst: accountIdDst.toString(),
      date,
      description
    };
    const data = await this.client(token).request(query, vars);
    this.log('createTransactionTransfer', data);

    return data.action;
  },

  // ---------------------------------
  // Favourite
  // ---------------------------------

  async toggleIsFavourite(token, id, model) {
    const query = `
      mutation($id:Int!, $model:String!) {
        action:toggleIsFavourite(id: $id, model: $model)
      }
    `;
    const data = await this.client(token).request(query, { id, model });
    this.log('toggleIsFavourite', data);

    return data.action;
  },

  // ---------------------------------
  // Reports
  // ---------------------------------

  async pricesChart(token, id) {
    const url = `${DOMAIN}/charts/s/prices?id=${id}`;
    const response = await fetch(url, { headers: this.headers(token) });
    const data = await response.json();
    this.log(url, data);

    return data;
  },

  async pricesChartOHLC({ token, id, interval }) {
    const url = `${DOMAIN}/charts/s/ohlc_prices?id=${id}&interval=${interval}`;
    const response = await fetch(url, { headers: this.headers(token) });
    const data = await response.json();
    this.log(url, data);

    return data;
  },

  async currenciesChart(name, base = 'RUB') {
    const url = `${DOMAIN}/charts/currencies/${name}.json?base=${base}`;
    const response = await fetch(url);
    const data = await response.json();
    this.log(url, data);

    return data;
  },

  // ---------------------------------
  // Common
  // ---------------------------------

  async currencies(base = 'RUB') {
    const query = `
      query($base:String!) {
        items:currencies(base: $base) { id name description usdRate baseRate }
      }
    `;
    const vars = { base };
    const data = await this.client().request(query, vars);
    this.log(query, data);

    return data.items;
  },

  async colors() {
    const query = '{ items:colors { id name } }';
    const data = await this.client().request(query);
    this.log(query, data);

    return data.items;
  },

  // ---------------------------------
  // Helpers
  // ---------------------------------

  client(token) {
    return new GraphQLClient(ENDPOINT, { headers: this.headers(token) });
  },

  headers(token) {
    if (process.env.NODE_ENV == 'development') { console.log(`Token: ${token}`); }
    return token ? { authorization: `Bearer ${token}` } : {};
  },

  log(query, data, vars) {
    if (process.env.NODE_ENV !== 'development') { return; }

    if (data != null) {
      console.log(query, JSON.stringify(data, undefined, 2));
    } else {
      console.log(query, 'Data is NULL!');
    }
    if (vars != null) {
      console.log(JSON.stringify({ vars }, undefined, 2));
    }
  }
};
