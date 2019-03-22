import {IViewStrategy, ClassHelper, InlineHandler} from "@treacherous/view";

export class TagViewStrategy implements IViewStrategy
{
    public strategyName = "inline";

    constructor(protected inlineHandler = new InlineHandler()){}

    public propertyBecomeValid(element: HTMLElement) {
        ClassHelper.removeClass(element, "invalid");
        ClassHelper.addClass(element, "valid");
        this.inlineHandler.removeErrorElement(element);
    }

    public propertyBecomeInvalid(element: HTMLElement, error: string) {
        ClassHelper.removeClass(element, "valid");
        ClassHelper.addClass(element, "invalid");
        const errorContainer = this.inlineHandler.addElementError(error, element);
        ClassHelper.addClass(errorContainer, "tag");
        ClassHelper.addClass(errorContainer, "is-danger");
    }
}