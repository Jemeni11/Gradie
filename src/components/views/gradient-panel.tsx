import { useAtomValue, useAtom } from "jotai";
import {
  convertedPaletteAtom,
  gradieModeAtom,
  gradientTypeAtom,
  gradientPositionAtom,
  gradientAngleAtom,
  radialShapeAtom,
  customPickStartAtom,
  customPickStopAtom,
  customPickEndAtom,
  imageAtom,
  loadingStateAtom,
} from "@/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { gradieModes, gradientTypes, gradientPositions } from "@/constants";
import {
  GradieMode,
  GradientPosition,
  GradientType,
  RadialShape,
} from "@/types";
import { capitalizeFirstLetter } from "@/utils";
import GradientArea from "./gradient-area";
import Loader from "./loader";

export default function GradientPanel() {
  const palette = useAtomValue(convertedPaletteAtom);

  const [gradientType, setGradientType] = useAtom(gradientTypeAtom);
  const [gradieMode, setGradieMode] = useAtom(gradieModeAtom);
  const [gradientPosition, setGradientPosition] = useAtom(gradientPositionAtom);
  const [gradientAngle, setGradientAngle] = useAtom(gradientAngleAtom);

  const [start, setStart] = useAtom(customPickStartAtom);
  const [stop, setStop] = useAtom(customPickStopAtom);
  const [end, setEnd] = useAtom(customPickEndAtom);

  const [radialShape, setRadialShape] = useAtom(radialShapeAtom);

  const image = useAtomValue(imageAtom);

  const loadingState = useAtomValue(loadingStateAtom);

  if (image.length === 0 || !palette) {
    return (
      <div className="border-gradie-2 flex size-full flex-col items-center gap-4 rounded-lg border border-solid py-4">
        Upload an image!
      </div>
    );
  }

  if (loadingState) {
    return <Loader />;
  }

  return (
    <div className="flex size-full flex-col gap-4 p-8">
      <GradientArea gradieMode={gradieMode} gradientType={gradientType} />

      <div>
        <h2 className="mb-4">Gradie Mode</h2>
        <Select
          value={gradieMode}
          onValueChange={(value) => setGradieMode(value as GradieMode)}
        >
          <SelectTrigger className="w-full">
            <SelectValue aria-label={gradieMode}>{gradieMode}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {gradieModes.map((mode) => (
              <SelectItem key={mode} value={mode}>
                {mode}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h2 className="mb-4">Gradient Type</h2>
        <ToggleGroup
          type="single"
          className="border-gradie-2 flex w-full border border-solid"
          value={gradientType}
          onValueChange={(value) => setGradientType(value as GradientType)}
        >
          {gradientTypes.map((type) => (
            <ToggleGroupItem
              key={type}
              value={type}
              aria-label={`Toggle ${type}`}
              className="flex-1 cursor-pointer"
            >
              <span className="font-medium">{capitalizeFirstLetter(type)}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {gradientType !== "linear" && (
        <div>
          <label htmlFor="gradientPosition">Postion</label>
          <Select
            value={gradientPosition}
            onValueChange={(value) =>
              setGradientPosition(value as GradientPosition)
            }
          >
            <SelectTrigger id="gradientPosition" className="mt-4 w-full">
              <SelectValue>{gradientPosition}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {gradientPositions.map((position) => (
                <SelectItem key={position} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {gradientType !== "radial" && (
        <div>
          <label htmlFor="gradientAngle">Angle</label>
          <Input
            id="gradientAngle"
            value={gradientAngle}
            type="number"
            min={-360}
            step={1}
            max={360}
            inputMode="numeric"
            onChange={(e) => {
              const numValue = Number(e.target.value);
              if (!isNaN(numValue)) {
                setGradientAngle(Math.max(-360, Math.min(360, numValue)));
              }
            }}
            className="mt-4 w-full"
            placeholder="Angle in degrees"
          />
        </div>
      )}

      {gradientType === "radial" && (
        <div>
          <label htmlFor="radialShape">Shape</label>
          <ToggleGroup
            id="radialShape"
            type="single"
            className="border-gradie-2 mt-4 flex w-full border border-solid"
            value={radialShape}
            onValueChange={(value) => setRadialShape(value as RadialShape)}
          >
            <ToggleGroupItem
              value="circle"
              aria-label="Toggle Circle"
              className="flex-1 cursor-pointer"
            >
              <span className="font-medium">
                {capitalizeFirstLetter("circle")}
              </span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="ellipse"
              aria-label="Toggle Ellipse"
              className="flex-1 cursor-pointer"
            >
              <span className="font-medium">
                {capitalizeFirstLetter("ellipse")}
              </span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}

      {gradieMode === "Custom" && (
        <div className="mt-4 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startColor">Start color</label>
              <Select value={start} onValueChange={setStart}>
                <SelectTrigger id="startColor" className="mt-4 w-full">
                  <SelectValue placeholder="Start" />
                </SelectTrigger>
                <SelectContent>
                  {palette.map((color) => (
                    <SelectItem key={color} value={color}>
                      <p className="inline-flex items-center gap-x-2">
                        <span
                          className="size-4 rounded-lg"
                          style={{
                            backgroundColor: color,
                          }}
                        />
                        <span>{color}</span>
                      </p>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="endColor">End color</label>
              <Select value={end} onValueChange={setEnd}>
                <SelectTrigger id="endColor" className="mt-4 w-full">
                  <SelectValue placeholder="End" />
                </SelectTrigger>
                <SelectContent>
                  {palette.map((color) => (
                    <SelectItem key={color} value={color}>
                      <p className="inline-flex items-center gap-x-2">
                        <span
                          className="size-4 rounded-lg"
                          style={{
                            backgroundColor: color,
                          }}
                        />
                        <span>{color}</span>
                      </p>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <label htmlFor="stopPercentage" className="mt-4">
            Stop %
          </label>
          <Slider
            value={[stop]}
            onValueChange={(values) => setStop(values[0])}
            min={0}
            max={100}
            step={1}
            className="mt-4 w-full"
            id="stopPercentage"
          />
          <p>{stop}%</p>
        </div>
      )}
    </div>
  );
}
