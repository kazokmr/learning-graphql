import React, {useState} from "react";
import {gql, useMutation} from "@apollo/client";
import {useNavigate} from "react-router-dom";

const POST_PHOTO_MUTATION = gql`
    mutation postPhoto($input: PostPhotoInput) {
        postPhoto(input: $input) {
            id
            name
            url
        }
    }
`;

export const PostPhoto = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("PORTRAIT");
  const [file, setFile] = useState("");

  const navigate = useNavigate();

  const [postPhotoMutation, {
    loading,
    error
  }] = useMutation(POST_PHOTO_MUTATION);

  const postPhoto = async () => {
    await postPhotoMutation({
      variables: {
        input: {
          name,
          description,
          category,
          file
        }
      }
    });
    navigate("/", {replace: true});
  }

  if (loading) return "写真登録中...";
  if (error) return `Post Error! ${error.message}`;

  return (
    <form onSubmit={e => e.preventDefault()}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start'
          }}>

      <h1>写真を投稿する</h1>

      <input type="text"
             style={{margin: '10px'}}
             placeholder="写真の名称..."
             value={name}
             onChange={({target}) => setName(target.value)}
      />

      <textarea style={{margin: '10px'}}
                placeholder="写真の詳細..."
                value={description}
                onChange={({target}) => setDescription(target.value)}
      />

      <select value={category}
              style={{margin: '10px'}}
              onChange={({target}) => setCategory(target.value)}>
        <option value="PORTRAIT">PORTRAIT</option>
        <option value="LANDSCAPE">LANDSCAPE</option>
        <option value="ACTION">ACTION</option>
        <option value="GRAPHIC">GRAPHIC</option>
      </select>

      <input type="file"
             style={{margin: '10px'}}
             accept="image/jpeg"
             onChange={({target}) => setFile(target.files && target.files.length ? target.files[0] : "")}
      />

      <div style={{margin: '10px'}}>
        <button onClick={() => postPhoto()}>写真を投稿する</button>
        <button onClick={() => navigate(-1)}>キャンセル</button>
      </div>
    </form>
  );
};
