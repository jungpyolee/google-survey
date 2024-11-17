import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import OptionItem from "./OptionItem";
import { useDispatch } from "react-redux";
import { moveOption, Question } from "../../../store/surveySlice";

const OptionList: React.FC<{ question: Question }> = ({ question }) => {
  const dispatch = useDispatch();

  const handleOnOptionDragEnd = (result: any) => {
    // moveOption 액션 디스패치
    const { source, destination } = result;
    if (!destination) return;

    // 드래그가 불가능한 '기타' 옵션이 있을 경우, 드래그가 끝난 위치가 '기타' 옵션이라면 드롭을 막기
    const isLastEtcOption =
      question.isEtc && destination.index === question.options.length - 1;
    if (isLastEtcOption) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    dispatch(
      moveOption({
        questionId: source.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
      }),
    );
  };

  return (
    <DragDropContext onDragEnd={handleOnOptionDragEnd}>
      <Droppable droppableId={question.id} direction="vertical">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {question.options.map((option, index) => (
              <OptionItem
                key={index}
                question={question}
                option={option}
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

export default OptionList;
