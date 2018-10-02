import {IViewStrategy, ClassHelper, InlineHandler} from "@treacherous/view";

export class TooltipViewStrategy implements IViewStrategy
{
    public strategyName = "inline";

    public propertyBecomeValid(element: HTMLElement) {
        ClassHelper.removeClass(element, "invalid");
        ClassHelper.addClass(element, "valid");
        const parent = element.parentElement;
        ClassHelper.removeClass(parent, "is-tooltip-danger");
        ClassHelper.removeClass(parent, "tooltip");
        parent.removeAttribute("data-tooltip");
    }

    public propertyBecomeInvalid(element: HTMLElement, error: string) {
        ClassHelper.removeClass(element, "valid");
        ClassHelper.addClass(element, "invalid");
        const parent = element.parentElement;
        ClassHelper.addClass(parent, "is-tooltip-danger");
        ClassHelper.addClass(parent, "tooltip");
        parent.setAttribute("data-tooltip", error);
    }
}