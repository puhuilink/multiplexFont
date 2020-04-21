import { AuthorizeObjectDao } from './AuthorizeObjectDao'
import { SchemaDecorator } from '../decorator'

const { schema } = SchemaDecorator

@schema('authorize_object')
class AuthorizeObjectUserDao extends AuthorizeObjectDao {

}

export {
  AuthorizeObjectUserDao
}
