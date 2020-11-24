// https://apollo.vuejs.org/zh-cn/guide/apollo/queries.html
// https://www.apollographql.com/docs/apollo-server/
import VueApollo from 'vue-apollo'
import Vue from 'vue'
import { imp } from './clientConfig'

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: imp,
  clients: { imp }
})

export default apolloProvider
