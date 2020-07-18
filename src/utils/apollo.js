// https://apollo.vuejs.org/zh-cn/guide/apollo/queries.html
// https://www.apollographql.com/docs/apollo-server/
import VueApollo from 'vue-apollo'
import Vue from 'vue'
import * as clients from './clientConfig'

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: clients.resource,
  clients: {
    ...clients
  }
})

export default apolloProvider
