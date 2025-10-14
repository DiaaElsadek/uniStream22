import React from "react";

export default function CoursePage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Course ID: {params.id}</h1>
    </div>
  );
}
