const dayjs = require('dayjs');
const UserResource = (user)=>{
    return {
        id:user._id,
        name:user.name,
        email:user.email,
        phone:user.phone,
        image:user.image,
        created_at:dayjs(user.createdAt).format('YYYY-MM-DD')
    }
}
const UserCollectionResource = (users) => {
    return users.map(user => UserResource(user));
};

module.exports={UserResource,UserCollectionResource}