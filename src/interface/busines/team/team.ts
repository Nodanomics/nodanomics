export interface IBaseTeamMember {
    id: string;
}

export interface ITeamMemberInfo {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
}
