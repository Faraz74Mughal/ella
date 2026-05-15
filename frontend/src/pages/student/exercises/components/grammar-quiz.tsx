import ExerciseHeader from "./exercise-header";

const GrammarQuiz = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <ExerciseHeader />

        {/* Progress */}
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
        </div>
        <p className="text-sm text-slate-500">Question {currentQ + 1} of {questions.length}</p>

        {/* Question Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          {/* MCQ */}
          {q.type === 'mcq' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">{q.question}</h3>
              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const selected = answers[currentQ] === opt;
                  return (
                    <button key={i} onClick={() => handleAnswer(opt)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3
                        ${selected ? 'border-indigo-500 bg-indigo-50 text-indigo-800' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'}`}>
                        {selected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-medium">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fill Blank */}
          {q.type === 'fill_blank' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">{q.question}</h3>
              <input
                type="text"
                value={answers[currentQ] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 font-medium"
              />
            </div>
          )}

          {/* Matching */}
          {q.type === 'matching' && (
            <MatchingQuestion data={q} onAnswer={(ans) => handleAnswer(ans)} userAnswer={answers[currentQ]} />
          )}

          {/* True/False */}
          {q.type === 'true_false' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">{q.question}</h3>
              <div className="flex gap-3">
                {['True', 'False'].map(val => {
                  const boolVal = val === 'True';
                  const selected = answers[currentQ] === boolVal;
                  return (
                    <button key={val} onClick={() => handleAnswer(boolVal)}
                      className={`flex-1 p-4 rounded-xl border-2 font-semibold transition-all
                        ${selected ? 'border-indigo-500 bg-indigo-50 text-indigo-800' : 'border-slate-200 hover:border-indigo-300'}`}>
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dialogue / Follow-up (Speaking) */}
          {(q.type === 'dialogue' || q.type === 'follow_up') && (
            <div className="space-y-4">
              {q.speaker && <p className="text-xs font-semibold text-indigo-600 uppercase">{q.speaker}</p>}
              <h3 className="text-lg font-semibold text-slate-800">{q.question}</h3>
              <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-6 text-center hover:border-indigo-300 transition-colors">
                <button className="w-16 h-16 rounded-full bg-indigo-500 hover:bg-indigo-600 flex items-center justify-center mx-auto mb-2">
                  <Mic size={24} className="text-white" />
                </button>
                <p className="text-sm text-slate-500">Tap to record your response</p>
              </div>
              <p className="text-xs text-slate-400">Expected: {q.expectedAnswer}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button 
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-50 flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Previous
          </button>

          {isLast ? (
            <button 
              onClick={calculateScore}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 flex items-center gap-2"
            >
              <Check size={16} /> Submit
            </button>
          ) : (
            <button 
              onClick={() => setCurrentQ(currentQ + 1)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 flex items-center gap-2"
            >
              Next <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default GrammarQuiz