import React from "react";
import {useQuery} from "@apollo/client";
import {ROOT_QUERY} from "./App";

export const Photos = () => {
  const {loading, error, data} = useQuery(ROOT_QUERY, {
    fetchPolicy: "cache-first",
  });

  if (loading) return "ロード中...";
  if (error) return `エラー: ${error.message}`;

  return (
    data.allPhotos.map(photo =>
      <img
        key={photo.id}
        src={`http://localhost:4000${photo.url}`}
        alt={photo.name}
        width={350}
      />
    )
  );
}
