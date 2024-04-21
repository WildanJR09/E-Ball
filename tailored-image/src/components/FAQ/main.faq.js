import React from "react";

const FAQ = () => {
  const lists = [
    {
      question: "What is Wizard-Tech to the world?",
      li: false,
      answer:
        "Our company is all about changing how people see and use their special gifted qualities and strengths. We believe everyone has amazing potential inside them, and we want to help everyone feel proud of what makes them unique and reach for their dreams. We know that tough times can make people feel sad, lost, or unsure about themselves, but we're here to help everyone through those moments and come out stronger.",
      color: "#D0E2DB",
    },
    {
      question: "Why choose Wizard-Tech?",
      li: false,
      answer: "Choosing Wizard-Tech means you're not just seeking a solution; you're embracing a partner who understands and values your unique journey through life's ups and downs. You are choosing to drive innovation around you and be part of a movement, to make humanity understand their unique gifts given to them. We believe every individual has the right to gain access to Life-changing technology, all in the palm of their hand.",
      color: "#FAAE2B",
    },
    {
      question: "Why the E-Ball?",
      answer:
        "The E-Ball is super easy to use and can understand how you feel and what you ask, giving you the right emotional support. It’s made so that everyone can use it easily without having to learn for too long.",
      color: "#FE98A3",
    },
  ];

  return (
    <>
      <div className="p-2 mt-2">
        {lists.map((list, index) => (
          <div key={index} className="mb-5 mt-5">
            <div
              className="border-2 border-black px-3 py-2 rounded-lg"
              style={{
                boxShadow: "0.4rem 0.4rem 0 #222",
                backgroundColor: list.color,
              }}
            >
              <h1 className="text-black text-base md:text-2xl">
                {list.question}
              </h1>
            </div>
            <div className="mt-3 text-gray-600 text-xs md:text-base">
              {!list.li ? (
                <>
                  <span>{list.answer}</span>
                </>
              ) : (
                <>
                  <ul style={{ listStyleType: "circle" }}>
                    {list.answer.map((ans, index) => (
                      <li key={index}>{ans.list_answer}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FAQ;
