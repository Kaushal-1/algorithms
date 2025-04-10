
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface CodeEditorProps {
  onRunCode: (code: string, language: string) => void;
  initialCode?: string;
  initialLanguage?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  onRunCode, 
  initialCode = '// Write your code here\n\n', 
  initialLanguage = 'javascript' 
}) => {
  const [code, setCode] = useState<string>(initialCode);
  const [language, setLanguage] = useState<string>(initialLanguage);

  const handleRunCode = () => {
    onRunCode(code, language);
  };

  return (
    <Card className="flex flex-col h-full border-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-foreground">Solution Editor</CardTitle>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px] bg-muted border-border">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="font-mono text-sm h-full min-h-[400px] resize-none bg-algos-darker p-4 border-border"
          spellCheck={false}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="border-border bg-muted hover:bg-muted/80">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium" onClick={handleRunCode}>
          <Play className="mr-2 h-4 w-4" />
          Run Code
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CodeEditor;
