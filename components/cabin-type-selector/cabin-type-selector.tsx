"use client";
import React from "react";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/card";

interface CabinTypeOption {
  id: number;
  name: string;
  value: string;
}

interface CabinTypeSelectorProps {
  onSelect: (cabinType: CabinTypeOption) => void;
}

const cabinTypeOptions: CabinTypeOption[] = [
  { id: 1, name: "اکونومی", value: "economy" },
  { id: 2, name: "بیزینس", value: "business" },
  { id: 3, name: "فرست کلاس", value: "first" }
];

const CabinTypeSelector: React.FC<CabinTypeSelectorProps> = ({ onSelect }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">لطفا نوع پروازتان را انتخاب کنید</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4">
        {cabinTypeOptions.map((option) => (
          <Button
            key={option.id}
            variant="outline"
            className="w-full justify-between"
            onClick={() => onSelect(option)}
          >
            {option.name}
          </Button>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          variant="default" 
          onClick={() => onSelect(cabinTypeOptions[0])}
        >
          انتخاب پیش‌فرض (اکونومی)
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CabinTypeSelector;