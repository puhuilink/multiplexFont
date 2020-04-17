import { ViewModel } from '../model/View.model'
// import { ViewDesignModel } from '../model/ViewDesign.model'

export class ViewController {
  async add () {
    const viewModel = new ViewModel({})
    // viewModel.find({
    //   where: {
    //     view_type: {
    //       _eq: 'h5'
    //     }
    //   },
    //   limit: 10,
    //   offset: 0,
    //   fields: [
    //     'view_id',
    //     'view_name',
    //     'view_title'
    //   ]
    // })
    const hasura = viewModel.findOne({
      where: {
        view_id: {
          _eq: 1
        }
      }
    })
    const query = hasura.query()
    const res = await hasura.await()
    console.log(query, res)
    // const viewDesignModel = new ViewDesignModel({})
    // viewDesignModel.findOne({
    //   where: {}
    // })
    //   .then(r => {
    //     console.log(r)
    //   })
  }
}
