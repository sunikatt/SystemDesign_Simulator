'use client';

import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useState } from 'react';
import type { QuizQuestion } from '@/lib/essentials';

type InteractiveQuizProps = {
  questions: QuizQuestion[];
};

export function InteractiveQuiz({ questions }: InteractiveQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  return (
    <div className="space-y-4">
      {questions.map((question, index) => {
        const selected = selectedAnswers[index];
        const hasAnswered = Boolean(selected);
        const isCorrect = selected === question.answer;

        return (
          <div key={question.question} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <h3 className="font-bold text-white">{index + 1}. {question.question}</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {question.options.map((option) => {
                const isSelected = selected === option;
                const isAnswer = question.answer === option;
                const optionStateClass = !hasAnswered
                  ? 'border-white/10 bg-black/20 text-slate-300 hover:border-cyan/40 hover:bg-cyan/10 hover:text-cyan-50'
                  : isAnswer
                    ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-50'
                    : isSelected
                      ? 'border-rose-400/50 bg-rose-500/15 text-rose-50'
                      : 'border-white/10 bg-black/20 text-slate-500';

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => setSelectedAnswers((answers) => ({ ...answers, [index]: option }))}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm transition ${optionStateClass} ${hasAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <span>{option}</span>
                    {hasAnswered && isAnswer && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />}
                    {hasAnswered && isSelected && !isAnswer && <XCircle className="h-4 w-4 shrink-0 text-rose-300" />}
                  </button>
                );
              })}
            </div>

            {hasAnswered && (
              <div className={`mt-3 rounded-2xl border p-3 text-sm leading-6 ${isCorrect ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100' : 'border-rose-400/20 bg-rose-500/10 text-rose-100'}`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold">{isCorrect ? 'Correct ✅' : 'Wrong ❌'}</p>
                    {!isCorrect && <p className="mt-1"><strong>Correct answer:</strong> {question.answer}</p>}
                    <p className="mt-1 opacity-95">{question.explanation}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedAnswers((answers) => {
                      const next = { ...answers };
                      delete next[index];
                      return next;
                    })}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Try again
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
