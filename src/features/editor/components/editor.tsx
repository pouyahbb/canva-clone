"use client";

import { fabric } from "fabric";
import useEditor from "@/features/editor/hooks/use-editor";
import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "@/features/editor/components/navbar";
import Sidebar from "@/features/editor/components/sidebar";
import Toolbar from "@/features/editor/components/toolbar";
import Footer from "@/features/editor/components/footer";
import { ActiveTool, selectionDependentTools } from "../types";
import { ShapeSidebar } from "./shapeSidebar";
import { FillColorSidebar } from "./fillColorSidebar";
import { StrokeColorSidebar } from "./strokeColorSidebar";
import { StrokeWidthSidebar } from "@/features/editor/components/strokeWidthSidebar";
import { OpacitySidebar } from "./opacitySidebar";
import { TextSidebar } from "./textSidebar";
import { FontSidebar } from "./fontSidebar";
import { ImageSidebar } from "./imageSidebar";
import { FilterSidebar } from "./filterSidebar";
import { AiSidebar } from "./aiSidebar";
import { RemoveBgSidebar } from "./removeBgSidebar";
import { DrawSidebar } from "./DrawSidebar";
import { SettingsSidebar } from "./SettingsSidebar";
import { ResponseType } from "@/features/projects/api/use-get-project";
import { useUpdateProject } from "@/features/projects/api/use-update-project";
import debounce from "lodash.debounce";

interface EditorProps {
  initialData: ResponseType["data"];
}

const Editor = ({initialData}:EditorProps) => {

  const { mutate } = useUpdateProject(initialData.id);
   // eslint-disable-next-line react-hooks/exhaustive-deps
   const debouncedSave = useCallback(
    debounce((values: { json: string; height: number; width: number }) => {
      mutate(values);
    }, 500),
    [mutate]
  );

  const canvasRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");

  const onClearSelection = useCallback(() => {
    if (selectionDependentTools.includes(activeTool)) {
      setActiveTool("select");
    }
  }, [activeTool]);

  const { init, editor } = useEditor({
    clearSelectionCallback: onClearSelection,
    saveCallback: debouncedSave,
    defaultState: initialData.json,
    defaultWidth: initialData.width,
    defaultHeight: initialData.height,
  });

  const onChangeActiveTool = useCallback(
    (tool: ActiveTool) => {
      if (tool === "draw") {
        editor?.enableDrawingMode();
      }
      if (activeTool === "draw") {
        editor?.disableDrawingMode();
      }
      if (tool === activeTool) {
        return setActiveTool("select");
      }

      setActiveTool(tool);
    },
    [activeTool, editor]
  );

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
    });

    return () => {
      canvas.dispose();
    };
  }, [init]);
  return (
    <div className="h-full flex flex-col">
      <Navbar
        id={initialData.id}
        editor={editor}
        activeTool={activeTool}
        onChangeActiveTool={onChangeActiveTool}
      />
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ShapeSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FillColorSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeColorSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeWidthSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <OpacitySidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <TextSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FontSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ImageSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FilterSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <AiSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <RemoveBgSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <DrawSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <SettingsSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <main className="bg-muted flex-1 overflow-auto !relative !flex !flex-col">
          <Toolbar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
            key={JSON.stringify(editor?.canvas.getActiveObject())}
          />
          <div
            className="flex-1 h-[calc(100%-124px)] bg-muted"
            ref={containerRef}
          >
            <canvas ref={canvasRef} />
          </div>
          <Footer editor={editor} />
        </main>
      </div>
    </div>
  );
};

export default Editor;
