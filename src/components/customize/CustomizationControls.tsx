'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Wand2 } from 'lucide-react';

const customizationFormSchema = z.object({
  dressLength: z.number().min(0).max(100).default(50),
  necklineDepth: z.number().min(0).max(100).default(20),
  sideSlit: z.boolean().default(false),
});

export type CustomizationFormData = z.infer<typeof customizationFormSchema>;

interface CustomizationControlsProps {
  onSubmit: (data: CustomizationFormData) => void;
  isLoading: boolean;
}

const CustomizationControls: React.FC<CustomizationControlsProps> = ({ onSubmit, isLoading }) => {
  const form = useForm<CustomizationFormData>({
    resolver: zodResolver(customizationFormSchema),
    defaultValues: {
      dressLength: 50,
      necklineDepth: 20,
      sideSlit: false,
    },
  });

  const { control, watch } = form;
  const dressLength = watch('dressLength');
  const necklineDepth = watch('necklineDepth');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Customize Your Outfit</CardTitle>
            <CardDescription>Adjust the sliders and toggles to modify the selected outfit.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <FormField
              control={control}
              name="dressLength"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Dress Length</FormLabel>
                    <span className="text-sm text-muted-foreground">{field.value}%</span>
                  </div>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      max={100}
                      step={1}
                      disabled={isLoading}
                      aria-label="Dress length slider"
                    />
                  </FormControl>
                  <FormDescription className="flex justify-between text-xs">
                    <span>Shorter</span>
                    <span>Longer</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="necklineDepth"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Neckline Depth</FormLabel>
                    <span className="text-sm text-muted-foreground">{field.value}%</span>
                  </div>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      max={100}
                      step={1}
                      disabled={isLoading}
                      aria-label="Neckline depth slider"
                    />
                  </FormControl>
                  <FormDescription className="flex justify-between text-xs">
                    <span>Higher</span>
                    <span>Deeper</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="sideSlit"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Side Slit</FormLabel>
                    <FormDescription>
                      Add or remove a side slit.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                      aria-label="Side slit toggle"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
              <Wand2 className="mr-2 h-5 w-5" />
              {isLoading ? 'Visualizing...' : 'Visualize Changes'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default CustomizationControls;
