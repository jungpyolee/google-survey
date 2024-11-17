import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { moveQuestion } from "../../store/surveySlice";

import { DragDropContext, Droppable } from "react-beautiful-dnd";
import QuestionItem from "./QuestionItem";

const Questions: React.FC = () => {
  const dispatch = useDispatch();
  const questions = useSelector((state: RootState) => state.survey.questions);
  const [focusedQuestionContainerId, setFocusedQuestionContainerId] = useState<
    string | null
  >(null);

  const handleOnDragEnd = (result: any) => {
    const { source, destination } = result;

    // If dropped outside the list, do nothing
    if (!destination) return;

    // If the position has not changed, do nothing
    if (source.index === destination.index) return;

    // Dispatch the action to move the question
    dispatch(
      moveQuestion({
        sourceIndex: source.index,
        destinationIndex: destination.index,
      }),
    );
    // Ensure focus is updated after drag ends
    const movedQuestionId = questions[destination.index].id;
    setFocusedQuestionContainerId(movedQuestionId);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="questions" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {questions.map((question, index) => (
              <QuestionItem
                key={question.id}
                question={question}
                index={index}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Questions;
