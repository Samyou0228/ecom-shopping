import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  validationErrors = {},
}) {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) => {
              let val = event.target.value;
              if (getControlItem.isNumberOnly && val !== "" && !/^\d+$/.test(val)) {
                return;
              }
              if (getControlItem.maxLength && val.length > getControlItem.maxLength) {
                return;
              }
              setFormData({
                ...formData,
                [getControlItem.name]: val,
              })
            }}
            disabled={getControlItem.disabled}
            maxLength={getControlItem.maxLength}
            className={`border-black/20 text-black placeholder:text-black/40 ${validationErrors[getControlItem.name] ? "border-red-500" : ""
              }`}
          />
        );

        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
            disabled={getControlItem.disabled}
          >
            <SelectTrigger
              className={`w-full border-black/20 ${validationErrors[getControlItem.name] ? "border-red-500" : ""
                }`}
            >
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                  <SelectItem key={optionItem.id} value={optionItem.id}>
                    {optionItem.label}
                  </SelectItem>
                ))
                : null}
            </SelectContent>
          </Select>
        );

        break;
      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            disabled={getControlItem.disabled}
            className={`border-black/20 text-black placeholder:text-black/40 ${validationErrors[getControlItem.name] ? "border-red-500" : ""
              }`}
          />
        );

        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className={`border-black/20 text-black placeholder:text-black/40 ${validationErrors[getControlItem.name] ? "border-red-500" : ""
              }`}
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1 text-black">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
            {validationErrors[controlItem.name] && (
              <p className="text-red-500 text-xs mt-1">{validationErrors[controlItem.name]}</p>
            )}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full bg-black hover:bg-black/80">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
