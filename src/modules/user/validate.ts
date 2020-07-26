import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { User } from "../../entity/users";


@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistConstraint
    implements ValidatorConstraintInterface {
    validate(email: string) {
        return User.findOne({ where: { email } }).then(user => {
            if (user) return false
            return true;
        })
    }
}

@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint
    implements ValidatorConstraintInterface {
    validate(username: string) {
        return User.findOne({ where: { username } }).then(user => {
            if (user) return false
            return true
        })
    }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUserAlreadyExistConstraint
        })
    }
}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailAlreadyExistConstraint
        })
    }
}