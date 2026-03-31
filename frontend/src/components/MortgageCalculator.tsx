'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calculator } from 'lucide-react';

interface MortgageCalculatorProps {
  price: number;
}

export function MortgageCalculator({ price: initialPrice }: MortgageCalculatorProps) {
  const [price, setPrice] = useState(initialPrice);
  const [depositPercent, setDepositPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(7.5); // Current Nepal average
  const [loanTerm, setLoanTerm] = useState(15);

  const depositAmount = useMemo(() => (price * depositPercent) / 100, [price, depositPercent]);
  const loanAmount = useMemo(() => price - depositAmount, [price, depositAmount]);

  const monthlyRepayment = useMemo(() => {
    const i = interestRate / 12 / 100;
    const n = loanTerm * 12;
    if (i === 0) return loanAmount / n;
    const factor = Math.pow(1 + i, n);
    return loanAmount * (i * factor) / (factor - 1);
  }, [loanAmount, interestRate, loanTerm]);

  const totalPayment = useMemo(() => monthlyRepayment * loanTerm * 12, [monthlyRepayment, loanTerm]);
  const totalInterest = useMemo(() => totalPayment - loanAmount, [totalPayment, loanAmount]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setPrice(initialPrice);
  }, [initialPrice]);

  if (!isMounted) {
    return null; // Prevent SSR hydration errors from Slider injecting script tags
  }

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <Calculator className="w-5 h-5 text-primary" />
        <CardTitle className="text-xl">Mortgage Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Property Price (NPR)</Label>
            <Input 
              id="price" 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(Number(e.target.value))} 
            />
          </div>
          <div className="space-y-2">
            <Label>Interest Rate (%)</Label>
            <div className="flex items-center gap-4">
              <Input 
                type="number" 
                step="0.1"
                value={interestRate} 
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm font-semibold text-primary">{interestRate}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Deposit ({depositPercent}%)</Label>
            <span className="text-sm font-bold">NPR {depositAmount.toLocaleString()}</span>
          </div>
          <Slider 
             value={[depositPercent]} 
             onValueChange={(vals: any) => setDepositPercent(vals[0])} 
             max={100} 
             step={1} 
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Loan Term ({loanTerm} years)</Label>
            <span className="text-sm font-bold">{loanTerm * 12} Months</span>
          </div>
          <Slider 
             value={[loanTerm]} 
             onValueChange={(vals: any) => setLoanTerm(vals[0])} 
             min={1} 
             max={30} 
             step={1} 
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="p-4 rounded-xl bg-primary/10 space-y-1">
            <p className="text-xs font-semibold text-primary uppercase">Monthly Payment</p>
            <p className="text-2xl font-bold tracking-tight">NPR {Math.round(monthlyRepayment).toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Total Interest</p>
            <p className="text-lg font-bold">NPR {Math.round(totalInterest).toLocaleString()}</p>
          </div>
        </div>
        
        <p className="text-[10px] text-muted-foreground text-center italic">
          * Figures are indicative only. Consult with your bank for exact terms.
        </p>
      </CardContent>
    </Card>
  );
}
