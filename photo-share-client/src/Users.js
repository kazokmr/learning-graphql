import React from "react";
import {gql, useMutation, useQuery} from "@apollo/client";
import {ROOT_QUERY} from "./App";

const ADD_FAKE_USERS_MUTATION = gql`
    mutation addFakeUsers($count:Int!) {
        addFakeUsers(count:$count) {
            githubLogin
            name
            avatar
        }
    }
`;

export const Users = () => {

  const {loading, error, data, refetch} = useQuery(ROOT_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  if (loading) return "ロード中...";
  if (error) return `エラー: ${error.message}`;

  return (
    <UserList
      count={data.totalUsers}
      users={data.allUsers}
      refetchUsers={refetch}
    />
  );
}

const UserList = ({count, users, refetchUsers}) => {

  const [addUsers, {loading, error}] = useMutation(ADD_FAKE_USERS_MUTATION, {
    variables: {count: 1},
    refetchQueries: [{query: ROOT_QUERY}],
  });

  if (loading) return "ダミーユーザー追加中...";
  if (error) return `追加エラー ${error.message}`;

  return (
    <div>
      <p>{count} Users</p>
      <button onClick={() => refetchUsers()}>ユーザー情報の更新</button>
      <button onClick={() => addUsers({variables: {count: 1}})}>
        テストユーザーを追加する
      </button>
      <ul>
        {users.map(user =>
          <UserListItem key={user.githubLogin}
                        name={user.name}
                        avatar={user.avatar}/>
        )}
      </ul>
    </div>
  );
}

const UserListItem = ({name, avatar}) =>
  <li>
    <img src={avatar} width={48} height={48} alt=""/>
    {name}
  </li>;
