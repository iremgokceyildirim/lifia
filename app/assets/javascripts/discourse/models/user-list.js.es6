import { ajax } from 'discourse/lib/ajax';
import RestModel from 'discourse/models/rest';
import Model from 'discourse/models/model';

const UserList = RestModel.extend({
    canLoadMore: Em.computed.notEmpty("more_topics_url"),
});

export default UserList;
