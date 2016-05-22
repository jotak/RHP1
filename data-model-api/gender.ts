"use strict";

enum Gender {
    Male,
    Female,
    Other
} export default Gender

namespace Gender {
    export function toString(gender: Gender): string {
        switch (gender) {
            case Gender.Male: return "male";
            case Gender.Female: return "female";
            default: return "other";
        }
    }
}
